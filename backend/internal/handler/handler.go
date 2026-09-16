package handler

import (
	"context"
	"errors"
	"health-plus/backend/internal/model"
	"health-plus/backend/internal/repository"
	"health-plus/backend/internal/service"
	"net/http"
)

type Store interface {
	ListDoctors(context.Context) ([]model.Doctor, error)
	GetDoctor(context.Context, string) (model.Doctor, error)
	CreateDoctor(context.Context, model.Doctor) (model.Doctor, error)
	UpdateDoctor(context.Context, string, model.Doctor) (model.Doctor, error)
	DeleteDoctor(context.Context, string) error
	ListSchedules(context.Context, string, string) ([]model.Schedule, error)
	UpsertSchedule(context.Context, model.Schedule) (model.Schedule, error)
	DeleteSchedule(context.Context, string, string) error
}
type Handler struct{ store Store }

func New(store Store) *Handler { return &Handler{store: store} }
func (a *Handler) health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (a *Handler) getDoctor(w http.ResponseWriter, r *http.Request) {
	d, err := a.store.GetDoctor(r.Context(), r.PathValue("id"))
	if errors.Is(err, repository.ErrNotFound) {
		writeError(w, http.StatusNotFound, "doctor not found")
		return
	}
	if err != nil {
		serverError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, d)
}

func (a *Handler) createDoctor(w http.ResponseWriter, r *http.Request) {
	var d model.Doctor
	if err := decode(r, &d); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := service.ValidateDoctor(d); err != nil {
		writeError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}
	d, err := a.store.CreateDoctor(r.Context(), d)
	if err != nil {
		serverError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, d)
}

func (a *Handler) updateDoctor(w http.ResponseWriter, r *http.Request) {
	var d model.Doctor
	if err := decode(r, &d); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := service.ValidateDoctor(d); err != nil {
		writeError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}
	d, err := a.store.UpdateDoctor(r.Context(), r.PathValue("id"), d)
	if errors.Is(err, repository.ErrNotFound) {
		writeError(w, http.StatusNotFound, "doctor not found")
		return
	}
	if err != nil {
		serverError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, d)
}

func (a *Handler) deleteDoctor(w http.ResponseWriter, r *http.Request) {
	err := a.store.DeleteDoctor(r.Context(), r.PathValue("id"))
	if errors.Is(err, repository.ErrNotFound) {
		writeError(w, http.StatusNotFound, "doctor not found")
		return
	}
	if err != nil {
		serverError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (a *Handler) listSchedules(w http.ResponseWriter, r *http.Request) {
	from, to := r.URL.Query().Get("from"), r.URL.Query().Get("to")
	if !service.ValidDate(from) || !service.ValidDate(to) || from > to {
		writeError(w, http.StatusBadRequest, "from and to must be valid dates")
		return
	}
	items, err := a.store.ListSchedules(r.Context(), from, to)
	if err != nil {
		serverError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, items)
}

func (a *Handler) upsertSchedule(w http.ResponseWriter, r *http.Request) {
	var s model.Schedule
	if err := decode(r, &s); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	s.DoctorID, s.WorkDate = r.PathValue("id"), r.PathValue("date")
	if err := service.ValidateSchedule(&s); err != nil {
		writeError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}
	s, err := a.store.UpsertSchedule(r.Context(), s)
	if err != nil {
		serverError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, s)
}

func (a *Handler) deleteSchedule(w http.ResponseWriter, r *http.Request) {
	err := a.store.DeleteSchedule(r.Context(), r.PathValue("id"), r.PathValue("date"))
	if err != nil {
		serverError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (a *Handler) listDoctors(w http.ResponseWriter, r *http.Request) {
	items, err := a.store.ListDoctors(r.Context())
	if err != nil {
		serverError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, items)
}
