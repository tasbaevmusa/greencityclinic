package database

import (
	"context"
	"embed"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"strings"
	"time"
)

//go:embed migrations/*.sql
var migrations embed.FS

func Open(ctx context.Context, url string) (*pgxpool.Pool, error) {
	db, err := pgxpool.New(ctx, url)
	if err != nil {
		return nil, err
	}
	for attempt := 1; attempt <= 15; attempt++ {
		pingCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
		err = db.Ping(pingCtx)
		cancel()
		if err == nil {
			break
		}
		log.Printf("waiting for database (attempt %d/15)", attempt)
		if attempt == 15 {
			break
		}
		select {
		case <-ctx.Done():
			db.Close()
			return nil, ctx.Err()
		case <-time.After(2 * time.Second):
		}
	}
	if err != nil {
		db.Close()
		return nil, fmt.Errorf("database unavailable: %w", err)
	}
	if err = migrate(ctx, db); err != nil {
		db.Close()
		return nil, fmt.Errorf("migration: %w", err)
	}
	return db, nil
}

func migrate(ctx context.Context, db *pgxpool.Pool) error {
	tx, err := db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	// Serialize migrations when multiple API instances start together.
	if _, err = tx.Exec(ctx, `SELECT pg_advisory_xact_lock(734921)`); err != nil {
		return err
	}
	if _, err = tx.Exec(ctx, `CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`); err != nil {
		return err
	}
	entries, err := migrations.ReadDir("migrations")
	if err != nil {
		return err
	}
	for _, entry := range entries {
		var exists bool
		if err = tx.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE name=$1)`, entry.Name()).Scan(&exists); err != nil {
			return err
		}
		if exists {
			continue
		}
		body, err := migrations.ReadFile("migrations/" + entry.Name())
		if err != nil {
			return err
		}
		// Older installations applied 001 at every boot without a ledger.
		// Upgrade their schema, but do not re-create staff deleted by an admin.
		if entry.Name() == "001_initial.sql" {
			var existing bool
			if err = tx.QueryRow(ctx, `SELECT to_regclass('doctors') IS NOT NULL`).Scan(&existing); err != nil {
				return err
			}
			if existing {
				body = []byte(strings.SplitN(string(body), "-- Initial clinic staff.", 2)[0])
			}
		}
		if _, err = tx.Exec(ctx, string(body)); err != nil {
			return fmt.Errorf("%s: %w", entry.Name(), err)
		}
		if _, err = tx.Exec(ctx, `INSERT INTO schema_migrations(name) VALUES ($1)`, entry.Name()); err != nil {
			return err
		}
	}
	return tx.Commit(ctx)
}
