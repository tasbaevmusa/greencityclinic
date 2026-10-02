package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net"
	"net/http"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

const cookieName = "clinic_admin_session"
const lifetime = 8 * time.Hour

type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
	Role  string `json:"role"`
}
type Service struct {
	db        *pgxpool.Pool
	origins   map[string]bool
	secure    bool
	dummyHash []byte
}

func New(db *pgxpool.Pool, origins map[string]bool, secure bool) *Service {
	dummy, err := bcrypt.GenerateFromPassword([]byte("invalid-account-timing-placeholder"), 12)
	if err != nil {
		panic(err)
	}
	return &Service{db: db, origins: origins, secure: secure, dummyHash: dummy}
}
func respond(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}
func failure(w http.ResponseWriter, status int, message string) {
	respond(w, status, map[string]string{"error": message})
}
func internal(w http.ResponseWriter, err error) {
	log.Printf("auth: %v", err)
	failure(w, 503, "Сервис входа временно недоступен")
}
func tokenHash(token string) string {
	sum := sha256.Sum256([]byte(token))
	return hex.EncodeToString(sum[:])
}
func (s *Service) validOrigin(w http.ResponseWriter, r *http.Request) bool {
	if !s.origins[r.Header.Get("Origin")] || r.Header.Get("Origin") == "" || r.Header.Get("X-Requested-With") != "clinic-admin" {
		failure(w, 403, "Недопустимый источник запроса")
		return false
	}
	return true
}
func (s *Service) current(r *http.Request) (User, error) {
	var user User
	cookie, err := r.Cookie(cookieName)
	if err != nil || len(cookie.Value) != 64 {
		return user, pgx.ErrNoRows
	}
	err = s.db.QueryRow(r.Context(), `SELECT a.id,a.email,a.name FROM admin_sessions s JOIN admins a ON a.id=s.admin_id WHERE s.token_hash=$1 AND s.expires_at>NOW()`, tokenHash(cookie.Value)).Scan(&user.ID, &user.Email, &user.Name)
	user.Role = "admin"
	return user, err
}
func (s *Service) RequireAdmin(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		if r.Method != "GET" && r.Method != "HEAD" && !s.validOrigin(w, r) {
			return
		}
		_, err := s.current(r)
		if errors.Is(err, pgx.ErrNoRows) {
			failure(w, 401, "Войдите в аккаунт администратора")
			return
		}
		if err != nil {
			internal(w, err)
			return
		}
		next(w, r)
	}
}
func (s *Service) Me(w http.ResponseWriter, r *http.Request) {
	user, err := s.current(r)
	if errors.Is(err, pgx.ErrNoRows) {
		failure(w, 401, "Сессия завершена")
		return
	}
	if err != nil {
		internal(w, err)
		return
	}
	respond(w, 200, user)
}
func (s *Service) Login(w http.ResponseWriter, r *http.Request) {
	if !s.validOrigin(w, r) {
		return
	}
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	decoder := json.NewDecoder(http.MaxBytesReader(w, r.Body, 4096))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&input); err != nil {
		failure(w, 400, "Некорректные данные входа")
		return
	}
	var extra any
	if decoder.Decode(&extra) != io.EOF || len(input.Password) > 72 || len(input.Email) > 254 {
		failure(w, 400, "Некорректные данные входа")
		return
	}
	// Trust the socket peer, never an arbitrary client-supplied forwarded IP.
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		ip = r.RemoteAddr
	}
	if _, err = s.db.Exec(r.Context(), `DELETE FROM login_attempts WHERE expires_at<NOW()`); err != nil {
		internal(w, err)
		return
	}
	for bucket, limit := range map[string]int{"ip:" + tokenHash(ip): 10, "global": 100} {
		var count int
		err = s.db.QueryRow(r.Context(), `INSERT INTO login_attempts(bucket,attempts,expires_at) VALUES($1,1,NOW()+INTERVAL '15 minutes') ON CONFLICT(bucket) DO UPDATE SET attempts=login_attempts.attempts+1 RETURNING attempts`, bucket).Scan(&count)
		if err != nil {
			internal(w, err)
			return
		}
		if count > limit {
			w.Header().Set("Retry-After", "900")
			failure(w, 429, "Слишком много попыток. Повторите через 15 минут.")
			return
		}
	}
	var user User
	var hash string
	err = s.db.QueryRow(r.Context(), `SELECT id,email,name,password_hash FROM admins WHERE email=$1`, strings.ToLower(strings.TrimSpace(input.Email))).Scan(&user.ID, &user.Email, &user.Name, &hash)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		internal(w, err)
		return
	}
	candidate := []byte(hash)
	if err != nil {
		candidate = s.dummyHash
	}
	match := bcrypt.CompareHashAndPassword(candidate, []byte(input.Password)) == nil
	if err != nil || !match {
		failure(w, 401, "Неверный email или пароль")
		return
	}
	bytes := make([]byte, 32)
	if _, err = rand.Read(bytes); err != nil {
		internal(w, err)
		return
	}
	token := hex.EncodeToString(bytes)
	tx, err := s.db.Begin(r.Context())
	if err != nil {
		internal(w, err)
		return
	}
	defer tx.Rollback(r.Context())
	// The account lock also serializes session issuance with password resets.
	var lockedHash string
	if err = tx.QueryRow(r.Context(), `SELECT password_hash FROM admins WHERE id=$1 FOR UPDATE`, user.ID).Scan(&lockedHash); err != nil {
		internal(w, err)
		return
	}
	if lockedHash != hash {
		failure(w, 401, "Пароль изменён. Повторите вход.")
		return
	}
	if _, err = tx.Exec(r.Context(), `DELETE FROM admin_sessions WHERE expires_at<=NOW()`); err != nil {
		internal(w, err)
		return
	}
	if old, e := r.Cookie(cookieName); e == nil {
		if _, err = tx.Exec(r.Context(), `DELETE FROM admin_sessions WHERE token_hash=$1`, tokenHash(old.Value)); err != nil {
			internal(w, err)
			return
		}
	}
	if _, err = tx.Exec(r.Context(), `INSERT INTO admin_sessions(token_hash,admin_id,expires_at) VALUES($1,$2,NOW()+INTERVAL '8 hours')`, tokenHash(token), user.ID); err != nil {
		internal(w, err)
		return
	}
	if err = tx.Commit(r.Context()); err != nil {
		internal(w, err)
		return
	}
	http.SetCookie(w, &http.Cookie{Name: cookieName, Value: token, Path: "/api", HttpOnly: true, Secure: s.secure, SameSite: http.SameSiteStrictMode, MaxAge: int(lifetime.Seconds()), Expires: time.Now().Add(lifetime)})
	user.Role = "admin"
	respond(w, 200, user)
}
func (s *Service) Logout(w http.ResponseWriter, r *http.Request) {
	if !s.validOrigin(w, r) {
		return
	}
	if cookie, err := r.Cookie(cookieName); err == nil {
		if _, err = s.db.Exec(r.Context(), `DELETE FROM admin_sessions WHERE token_hash=$1`, tokenHash(cookie.Value)); err != nil {
			internal(w, err)
			return
		}
	}
	http.SetCookie(w, &http.Cookie{Name: cookieName, Path: "/api", HttpOnly: true, Secure: s.secure, SameSite: http.SameSiteStrictMode, MaxAge: -1, Expires: time.Unix(1, 0)})
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(204)
}
