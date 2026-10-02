package handler_test

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
	"health-plus/backend/internal/auth"
	"health-plus/backend/internal/database"
	"health-plus/backend/internal/handler"
	"health-plus/backend/internal/model"
	"health-plus/backend/internal/repository"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"
)

// A dedicated test database is required; never points at application data by default.
func TestPostgresAPI(t *testing.T) {
	url := os.Getenv("TEST_DATABASE_URL")
	if url == "" {
		t.Skip("set TEST_DATABASE_URL to a dedicated test database")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 90*time.Second)
	defer cancel()
	db, err := database.Open(ctx, url)
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	schema := fmt.Sprintf("api_test_%d", time.Now().UnixNano())
	quoted := pgx.Identifier{schema}.Sanitize()
	if _, err = db.Exec(ctx, "CREATE SCHEMA "+quoted); err != nil {
		t.Fatal(err)
	}
	defer func() {
		if _, err := db.Exec(context.Background(), "DROP SCHEMA "+quoted+" CASCADE"); err != nil {
			t.Error(err)
		}
	}()
	// Separate pool scoped to this test's schema. Production tables are never touched.
	// Use connection options through a URL parameter to apply the scope to migrations too.
	separator := "?"
	if strings.Contains(url, "?") {
		separator = "&"
	}
	isolated, err := database.Open(ctx, url+separator+"search_path="+schema)
	if err != nil {
		t.Fatal(err)
	}
	defer isolated.Close()
	store := repository.New(isolated)
	authService := auth.New(isolated, map[string]bool{"http://localhost:3000": true}, true)
	routes := handler.New(store, handler.WithAuth(authService), handler.WithContent(store)).Routes()
	hash, err := bcrypt.GenerateFromPassword([]byte("integration-test-password"), 12)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = isolated.Exec(ctx, "INSERT INTO admins(email,password_hash) VALUES($1,$2)", "admin@example.com", string(hash)); err != nil {
		t.Fatal(err)
	}
	var session *http.Cookie
	request := func(method, path, body string, status int) []byte {
		t.Helper()
		w := httptest.NewRecorder()
		r := httptest.NewRequest(method, path, strings.NewReader(body)).WithContext(ctx)
		r.Header.Set("Origin", "http://localhost:3000")
		r.Header.Set("X-Requested-With", "clinic-admin")
		if session != nil {
			r.AddCookie(session)
		}
		routes.ServeHTTP(w, r)
		for _, cookie := range w.Result().Cookies() {
			if cookie.Name == "clinic_admin_session" {
				session = cookie
			}
		}
		if w.Code != status {
			t.Fatalf("%s %s: %d %s", method, path, w.Code, w.Body.String())
		}
		return w.Body.Bytes()
	}
	request("GET", "/api/doctors", "", 200)
	request("GET", "/api/auth/me", "", 401)
	request("POST", "/api/doctors", "{}", 401)
	request("POST", "/api/auth/login", `{"email":"admin@example.com","password":"wrong"}`, 401)
	request("POST", "/api/auth/login", `{"email":"admin@example.com","password":"integration-test-password"}`, 200)
	if session == nil || !session.HttpOnly || !session.Secure || session.SameSite != http.SameSiteStrictMode {
		t.Fatal("unsafe session cookie")
	}
	request("GET", "/api/auth/me", "", 200)
	for _, origin := range []string{"", "https://attacker.example"} {
		r := httptest.NewRequest("POST", "/api/doctors", strings.NewReader("{}"))
		r.AddCookie(session)
		r.Header.Set("Origin", origin)
		r.Header.Set("X-Requested-With", "clinic-admin")
		w := httptest.NewRecorder()
		routes.ServeHTTP(w, r)
		if w.Code != 403 {
			t.Fatalf("CSRF: %d", w.Code)
		}
	}
	payload := `{"name":" Test Doctor ","position":"Therapist","description":"Test","image":""}`
	var doctor model.Doctor
	if err = json.Unmarshal(request("POST", "/api/doctors", payload, 201), &doctor); err != nil {
		t.Fatal(err)
	}
	if doctor.ID == "" || doctor.Name != "Test Doctor" {
		t.Fatalf("invalid doctor: %+v", doctor)
	}
	path := "/api/doctors/" + doctor.ID
	request("GET", path, "", 200)
	request("PUT", path, strings.Replace(payload, "Therapist", "Cardiologist", 1), 200)
	shiftPath := path + "/schedules/2026-09-16"
	request("PUT", shiftPath, `{"type":"work","start":"08:00","end":"17:00","note":"test"}`, 200)
	var shifts []model.Schedule
	if err = json.Unmarshal(request("GET", "/api/schedules?from=2026-09-16&to=2026-09-16", "", 200), &shifts); err != nil {
		t.Fatal(err)
	}
	if len(shifts) != 1 || shifts[0].Start == nil || *shifts[0].Start != "08:00" {
		t.Fatalf("invalid schedules: %+v", shifts)
	}
	request("PUT", shiftPath, `{"type":"dayoff"}`, 200)
	request("DELETE", shiftPath, "", 204)
	request("DELETE", path, "", 204)
	request("GET", path, "", 404)
	news := `[{"id":"legacy-1","title":"Local news","category":"Clinic","description":"Saved in browser","source":"Clinic","url":"https://example.com/news"}]`
	request("POST", "/api/admin/content/news/import", news, 204)
	request("POST", "/api/admin/content/news/import", news, 409)
	if body := request("GET", "/api/content/news", "", 200); !strings.Contains(string(body), "Local news") || strings.Contains(string(body), "news-1") {
		t.Fatalf("import: %s", body)
	}
	request("POST", "/api/admin/content/reviews/import", `[{"id":"bad","name":"Name","message":"Text","rating":9}]`, 422)
	if body := request("GET", "/api/content/reviews", "", 200); !strings.Contains(string(body), "2gis-1") {
		t.Fatal("invalid import changed data")
	}
	for _, tc := range []struct {
		kind, payload string
		public        bool
	}{
		{"news", `{"title":"Created news","category":"Clinic","description":"Text","source":"Clinic","url":"https://example.com","translationKey":"news-1"}`, true},
		{"reviews", `{"name":"Reviewer","message":"Text","rating":3}`, false},
		{"vacancies", `{"title":"Draft vacancy","department":"Clinic","employment":"Full time","description":"Text","requirements":"Experience","contact":"hr@example.com","published":false}`, false},
	} {
		path := "/api/admin/content/" + tc.kind
		var item model.Content
		if err = json.Unmarshal(request("POST", path, tc.payload, 201), &item); err != nil {
			t.Fatal(err)
		}
		if item.ID == "" || item.TranslationKey != "" {
			t.Fatal("invalid saved content")
		}
		if body := request("GET", path, "", 200); !strings.Contains(string(body), item.ID) {
			t.Fatal("admin cannot see content")
		}
		savedSession := session
		session = nil
		body := request("GET", "/api/content/"+tc.kind, "", 200)
		if strings.Contains(string(body), item.ID) != tc.public {
			t.Fatalf("publication filter: %s", body)
		}
		request("GET", path, "", 401)
		request("PUT", path+"/"+item.ID, tc.payload, 401)
		session = savedSession
		updated := strings.ReplaceAll(tc.payload, "Text", "Updated")
		request("PUT", path+"/"+item.ID, updated, 200)
		if tc.kind == "vacancies" {
			request("PUT", path+"/"+item.ID, strings.Replace(updated, `"published":false`, `"published":true`, 1), 200)
			if body := request("GET", "/api/content/vacancies", "", 200); !strings.Contains(string(body), item.ID) {
				t.Fatal("published vacancy missing")
			}
		}
		request("DELETE", path+"/"+item.ID, "", 204)
		request("PUT", path+"/"+item.ID, updated, 404)
	}
	reopened, err := database.Open(ctx, url+separator+"search_path="+schema)
	if err != nil {
		t.Fatal(err)
	}
	reopened.Close()
	if body := request("GET", "/api/content/news", "", 200); strings.Contains(string(body), "news-1") {
		t.Fatal("migration reseeded deleted content")
	}
	if body := request("GET", "/api/doctors", "", 200); strings.Contains(string(body), doctor.ID) {
		t.Fatal("migration restored deleted doctor")
	}
	routes = handler.New(store, handler.WithAuth(auth.New(isolated, map[string]bool{"http://localhost:3000": true}, true)), handler.WithContent(store)).Routes()
	request("GET", "/api/auth/me", "", 200)
	oldSession := session
	request("POST", "/api/auth/logout", "", 204)
	session = oldSession
	request("GET", "/api/auth/me", "", 401)
	request("DELETE", "/api/doctors/"+doctor.ID, "", 401)
	request("POST", "/api/auth/login", `{"email":"admin@example.com","password":"integration-test-password"}`, 200)
	if _, err = isolated.Exec(ctx, "UPDATE admin_sessions SET expires_at=NOW()-INTERVAL '1 second'"); err != nil {
		t.Fatal(err)
	}
	request("GET", "/api/auth/me", "", 401)
	for i := 0; i < 7; i++ {
		request("POST", "/api/auth/login", `{"email":"admin@example.com","password":"wrong"}`, 401)
	}
	request("POST", "/api/auth/login", `{"email":"admin@example.com","password":"wrong"}`, 429)
}
