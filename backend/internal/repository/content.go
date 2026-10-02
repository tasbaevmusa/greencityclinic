package repository

import (
	"context"
	"encoding/json"
	"errors"
	"health-plus/backend/internal/model"
)

var ErrContentCustomized = errors.New("server content already edited")

func (p *Postgres) ListContent(ctx context.Context, kind string, admin bool) ([]model.Content, error) {
	rows, err := p.db.Query(ctx, `SELECT data FROM site_content WHERE kind=$1 AND ($2 OR (kind='news') OR (kind='reviews' AND (data->>'rating')::int>=4) OR (kind='vacancies' AND data->>'published'='true')) ORDER BY created_at DESC, id`, kind, admin)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []model.Content{}
	for rows.Next() {
		var raw []byte
		if err = rows.Scan(&raw); err != nil {
			return nil, err
		}
		var item model.Content
		if err = json.Unmarshal(raw, &item); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}
func (p *Postgres) SaveContent(ctx context.Context, kind string, item model.Content, create bool) (model.Content, error) {
	tx, err := p.db.Begin(ctx)
	if err != nil {
		return item, err
	}
	defer tx.Rollback(ctx)
	if _, err = tx.Exec(ctx, `UPDATE content_collections SET customized=TRUE WHERE kind=$1`, kind); err != nil {
		return item, err
	}
	if create {
		if err = tx.QueryRow(ctx, `SELECT gen_random_uuid()::text`).Scan(&item.ID); err != nil {
			return item, err
		}
	}
	item.TranslationKey = ""
	raw, err := json.Marshal(item)
	if err != nil {
		return item, err
	}
	if create {
		_, err = tx.Exec(ctx, `INSERT INTO site_content(kind,id,data) VALUES($1,$2,$3)`, kind, item.ID, raw)
	} else {
		result, e := tx.Exec(ctx, `UPDATE site_content SET data=$3,updated_at=NOW() WHERE kind=$1 AND id=$2`, kind, item.ID, raw)
		err = e
		if err == nil && result.RowsAffected() == 0 {
			return item, ErrNotFound
		}
	}
	if err != nil {
		return item, err
	}
	return item, tx.Commit(ctx)
}
func (p *Postgres) DeleteContent(ctx context.Context, kind, id string) error {
	tx, err := p.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	if _, err = tx.Exec(ctx, `UPDATE content_collections SET customized=TRUE WHERE kind=$1`, kind); err != nil {
		return err
	}
	result, err := tx.Exec(ctx, `DELETE FROM site_content WHERE kind=$1 AND id=$2`, kind, id)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrNotFound
	}
	return tx.Commit(ctx)
}

// Import is available only before the first server edit, under the same lock
// used by normal CRUD. Retrying or two browsers cannot overwrite newer data.
func (p *Postgres) ImportContent(ctx context.Context, kind string, items []model.Content) error {
	tx, err := p.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	var customized bool
	if err = tx.QueryRow(ctx, `SELECT customized FROM content_collections WHERE kind=$1 FOR UPDATE`, kind).Scan(&customized); err != nil {
		return err
	}
	if customized {
		return ErrContentCustomized
	}
	if _, err = tx.Exec(ctx, `DELETE FROM site_content WHERE kind=$1`, kind); err != nil {
		return err
	}
	for i, item := range items {
		item.TranslationKey = ""
		raw, e := json.Marshal(item)
		if e != nil {
			return e
		}
		if _, err = tx.Exec(ctx, `INSERT INTO site_content(kind,id,data,created_at) VALUES($1,$2,$3,NOW()-($4::int * INTERVAL '1 microsecond'))`, kind, item.ID, raw, i); err != nil {
			return err
		}
	}
	if _, err = tx.Exec(ctx, `UPDATE content_collections SET customized=TRUE WHERE kind=$1`, kind); err != nil {
		return err
	}
	return tx.Commit(ctx)
}
