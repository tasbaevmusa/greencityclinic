package handler

import (
	"context"
	"errors"
	"health-plus/backend/internal/model"
	"health-plus/backend/internal/repository"
	"health-plus/backend/internal/service"
	"net/http"
)

type ContentStore interface {
	ListContent(context.Context, string, bool) ([]model.Content, error)
	SaveContent(context.Context, string, model.Content, bool) (model.Content, error)
	DeleteContent(context.Context, string, string) error
	ImportContent(context.Context, string, []model.Content) error
}

func (a *Handler) contentKind(w http.ResponseWriter, r *http.Request) (string, bool) {
	kind := r.PathValue("kind")
	if !service.ValidContentKind(kind) {
		writeError(w, 404, "Раздел не найден")
		return "", false
	}
	if a.content == nil {
		writeError(w, 503, "Сервис недоступен")
		return "", false
	}
	return kind, true
}
func (a *Handler) listContent(admin bool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		kind, ok := a.contentKind(w, r)
		if !ok {
			return
		}
		items, err := a.content.ListContent(r.Context(), kind, admin)
		if err != nil {
			serverError(w, err)
			return
		}
		w.Header().Set("Cache-Control", "no-store")
		writeJSON(w, 200, items)
	}
}
func (a *Handler) saveContent(w http.ResponseWriter, r *http.Request) {
	kind, ok := a.contentKind(w, r)
	if !ok {
		return
	}
	var item model.Content
	if err := decode(r, &item); err != nil {
		writeError(w, 400, "Некорректные данные")
		return
	}
	create := r.Method == "POST"
	if create {
		item.ID = ""
	} else {
		item.ID = r.PathValue("id")
	}
	if err := service.ValidateContent(kind, item); err != nil {
		writeError(w, 422, err.Error())
		return
	}
	saved, err := a.content.SaveContent(r.Context(), kind, item, create)
	if errors.Is(err, repository.ErrNotFound) {
		writeError(w, 404, "Запись не найдена")
		return
	}
	if err != nil {
		serverError(w, err)
		return
	}
	status := 200
	if create {
		status = 201
	}
	writeJSON(w, status, saved)
}
func (a *Handler) deleteContent(w http.ResponseWriter, r *http.Request) {
	kind, ok := a.contentKind(w, r)
	if !ok {
		return
	}
	err := a.content.DeleteContent(r.Context(), kind, r.PathValue("id"))
	if errors.Is(err, repository.ErrNotFound) {
		writeError(w, 404, "Запись не найдена")
		return
	}
	if err != nil {
		serverError(w, err)
		return
	}
	w.WriteHeader(204)
}
func (a *Handler) importContent(w http.ResponseWriter, r *http.Request) {
	kind, ok := a.contentKind(w, r)
	if !ok {
		return
	}
	var items []model.Content
	if err := decode(r, &items); err != nil || items == nil || len(items) > 1000 {
		writeError(w, 400, "Ожидается список до 1000 записей")
		return
	}
	seen := map[string]bool{}
	for _, item := range items {
		if !service.ValidContentID(item.ID) || seen[item.ID] {
			writeError(w, 422, "Некорректный или повторяющийся ID")
			return
		}
		seen[item.ID] = true
		if err := service.ValidateContent(kind, item); err != nil {
			writeError(w, 422, err.Error())
			return
		}
	}
	err := a.content.ImportContent(r.Context(), kind, items)
	if errors.Is(err, repository.ErrContentCustomized) {
		writeError(w, 409, "На сервере уже есть правки. Импорт не выполнен, чтобы их не перезаписать.")
		return
	}
	if err != nil {
		serverError(w, err)
		return
	}
	w.WriteHeader(204)
}
