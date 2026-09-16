package handler_test

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/jackc/pgx/v5"
	"health-plus/backend/internal/database"
	"health-plus/backend/internal/handler"
	"health-plus/backend/internal/model"
	"health-plus/backend/internal/repository"
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
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
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
	routes := handler.New(repository.New(isolated)).Routes()
	request := func(method, path, body string, status int) []byte {
		t.Helper()
		w := httptest.NewRecorder()
		r := httptest.NewRequest(method, path, strings.NewReader(body)).WithContext(ctx)
		routes.ServeHTTP(w, r)
		if w.Code != status {
			t.Fatalf("%s %s: %d %s", method, path, w.Code, w.Body.String())
		}
		return w.Body.Bytes()
	}
	request("GET", "/api/doctors", "", 200)
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
}
