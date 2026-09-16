package config

import (
	"os"
	"strings"
)

type Config struct {
	Port        string
	DatabaseURL string
	Origins     map[string]bool
}

func Load() Config {
	return Config{Port: env("PORT", "8080"), DatabaseURL: env("DATABASE_URL", "postgres://myuser:mypassword@localhost:5432/mydb?sslmode=disable"), Origins: originSet(env("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"))}
}
func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
func originSet(csv string) map[string]bool {
	values := map[string]bool{}
	for _, value := range strings.Split(csv, ",") {
		values[strings.TrimSpace(value)] = true
	}
	return values
}
