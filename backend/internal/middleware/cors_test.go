package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCORS(t *testing.T) {
	h := CORS(map[string]bool{"http://localhost:3000": true}, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(200) }))
	for _, origin := range []string{"http://localhost:3000", "https://other.example"} {
		r := httptest.NewRequest("OPTIONS", "/api/doctors", nil)
		r.Header.Set("Origin", origin)
		w := httptest.NewRecorder()
		h.ServeHTTP(w, r)
		if w.Code != 204 {
			t.Fatal(w.Code)
		}
		expected := ""
		if origin == "http://localhost:3000" {
			expected = origin
		}
		if w.Header().Get("Access-Control-Allow-Origin") != expected {
			t.Fatal("incorrect CORS origin")
		}
	}
}
