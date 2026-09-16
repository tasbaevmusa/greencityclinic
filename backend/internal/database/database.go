package database

import (
	"context"
	_ "embed"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"time"
)

//go:embed migrations/001_initial.sql
var schema string

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
	if _, err = db.Exec(ctx, schema); err != nil {
		db.Close()
		return nil, fmt.Errorf("migration: %w", err)
	}
	return db, nil
}
