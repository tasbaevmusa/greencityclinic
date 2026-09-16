package handler

import "net/http"

func (a *Handler) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", a.health)
	mux.HandleFunc("GET /api/doctors", a.listDoctors)
	mux.HandleFunc("POST /api/doctors", a.createDoctor)
	mux.HandleFunc("GET /api/doctors/{id}", a.getDoctor)
	mux.HandleFunc("PUT /api/doctors/{id}", a.updateDoctor)
	mux.HandleFunc("DELETE /api/doctors/{id}", a.deleteDoctor)
	mux.HandleFunc("GET /api/schedules", a.listSchedules)
	mux.HandleFunc("PUT /api/doctors/{id}/schedules/{date}", a.upsertSchedule)
	mux.HandleFunc("DELETE /api/doctors/{id}/schedules/{date}", a.deleteSchedule)

	return mux
}
