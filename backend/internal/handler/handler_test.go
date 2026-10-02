package handler

import (
	"context"
	"health-plus/backend/internal/auth"
	"health-plus/backend/internal/model"
	"health-plus/backend/internal/repository"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

type stubStore struct{ Store }

func (stubStore) ListDoctors(context.Context) ([]model.Doctor, error) { return []model.Doctor{}, nil }
func (stubStore) GetDoctor(context.Context, string) (model.Doctor, error) {
	return model.Doctor{}, repository.ErrNotFound
}

func TestHTTPContract(t *testing.T) {
	routes := New(stubStore{}, WithAuth(testAuth{})).Routes()
	for _, tc := range []struct {
		method, path, body string
		status             int
		contains           string
	}{
		{"GET", "/health", "", 200, `"status":"ok"`},
		{"GET", "/api/doctors", "", 200, "[]"},
		{"GET", "/api/doctors/missing", "", 404, "doctor not found"},
		{"POST", "/api/doctors", "{", 400, "error"},
		{"POST", "/api/doctors", `{"unexpected":true}`, 400, "error"},
		{"POST", "/api/doctors", `{"name":" "}`, 422, "required"},
		{"GET", "/api/schedules?from=2026-09-20&to=2026-09-01", "", 400, "valid dates"},
		{"PUT", "/api/doctors/id/schedules/2026-09-16", `{"type":"work","start":"25:00","end":"26:00"}`, 422, "valid start"},
	} {
		t.Run(tc.method+tc.path+tc.body, func(t *testing.T) {
			w := httptest.NewRecorder()
			routes.ServeHTTP(w, httptest.NewRequest(tc.method, tc.path, strings.NewReader(tc.body)))
			if w.Code != tc.status || !strings.Contains(w.Body.String(), tc.contains) {
				t.Fatalf("status %d, body %s", w.Code, w.Body.String())
			}
		})
	}
}

// Validation contract tests above deliberately run after authentication.
type testAuth struct{ Auth }

func (testAuth) RequireAdmin(next http.HandlerFunc) http.HandlerFunc { return next }
func TestAnonymousCannotMutate(t *testing.T) {
	for _, configured := range []bool{false, true} {
		api := New(stubStore{})
		if configured {
			api.auth = auth.New(nil, map[string]bool{"http://localhost:3000": true}, true)
		}
		for _, path := range []string{"/api/doctors", "/api/doctors/id", "/api/doctors/id/schedules/2026-09-29", "/api/admin/content/news", "/api/admin/content/news/id", "/api/admin/content/news/import"} {
			for _, method := range []string{"POST", "PUT", "DELETE"} {
				r := httptest.NewRequest(method, path, strings.NewReader(`{}`))
				r.Header.Set("Origin", "http://localhost:3000")
				r.Header.Set("X-Requested-With", "clinic-admin")
				w := httptest.NewRecorder()
				api.Routes().ServeHTTP(w, r)
				if w.Code != 401 && w.Code != 405 {
					t.Fatalf("configured=%v %s %s: %d", configured, method, path, w.Code)
				}
			}
		}
	}
}
