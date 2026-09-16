package handler

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
)

func decode(r *http.Request, target any) error {
	defer r.Body.Close()
	d := json.NewDecoder(io.LimitReader(r.Body, 8<<20))
	d.DisallowUnknownFields()
	return d.Decode(target)
}
func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
func serverError(w http.ResponseWriter, err error) {
	log.Printf("server error: %v", err)
	writeError(w, http.StatusInternalServerError, "internal server error")
}
