package handler

import "net/http"

func (a *Handler) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", a.health)
	mux.HandleFunc("GET /api/doctors", a.listDoctors)
	mux.HandleFunc("POST /api/doctors", a.admin(a.createDoctor))
	mux.HandleFunc("GET /api/doctors/{id}", a.getDoctor)
	mux.HandleFunc("PUT /api/doctors/{id}", a.admin(a.updateDoctor))
	mux.HandleFunc("DELETE /api/doctors/{id}", a.admin(a.deleteDoctor))
	mux.HandleFunc("GET /api/schedules", a.listSchedules)
	mux.HandleFunc("PUT /api/doctors/{id}/schedules/{date}", a.admin(a.upsertSchedule))
	mux.HandleFunc("DELETE /api/doctors/{id}/schedules/{date}", a.admin(a.deleteSchedule))
	if a.auth != nil {
		mux.HandleFunc("POST /api/auth/login", a.auth.Login)
		mux.HandleFunc("POST /api/auth/logout", a.auth.Logout)
		mux.HandleFunc("GET /api/auth/me", a.auth.Me)
	}
	mux.HandleFunc("GET /api/content/{kind}", a.listContent(false))
	mux.HandleFunc("GET /api/admin/content/{kind}", a.admin(a.listContent(true)))
	mux.HandleFunc("POST /api/admin/content/{kind}", a.admin(a.saveContent))
	mux.HandleFunc("PUT /api/admin/content/{kind}/{id}", a.admin(a.saveContent))
	mux.HandleFunc("DELETE /api/admin/content/{kind}/{id}", a.admin(a.deleteContent))
	mux.HandleFunc("POST /api/admin/content/{kind}/import", a.admin(a.importContent))

	return mux
}
