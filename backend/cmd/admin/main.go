// Creates or resets an administrator using a password read from stdin.
package main

import (
	"bufio"
	"context"
	"flag"
	"fmt"
	"log"
	"net/mail"
	"os"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
	"health-plus/backend/internal/config"
	"health-plus/backend/internal/database"
)

func main() {
	email := flag.String("email", "", "administrator email")
	flag.Parse()
	*email = strings.ToLower(strings.TrimSpace(*email))
	address, err := mail.ParseAddress(*email)
	if err != nil || address.Address != *email {
		log.Fatal("a valid -email is required")
	}
	// Do not accept passwords as command arguments or print them to logs.
	password, err := bufio.NewReader(os.Stdin).ReadString('\n')
	if err != nil && len(password) == 0 {
		log.Fatal("read password from stdin: ", err)
	}
	password = strings.TrimSuffix(strings.TrimSuffix(password, "\n"), "\r")
	if len(password) < 14 || len(password) > 72 {
		log.Fatal("password must contain 14 to 72 bytes")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		log.Fatal(err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	db, err := database.Open(ctx, config.Load().DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	tx, err := db.Begin(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer tx.Rollback(ctx)
	var id string
	if err = tx.QueryRow(ctx, `INSERT INTO admins(email,password_hash) VALUES($1,$2) ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash RETURNING id`, *email, string(hash)).Scan(&id); err != nil {
		log.Fatal(err)
	}
	if _, err = tx.Exec(ctx, `DELETE FROM admin_sessions WHERE admin_id=$1`, id); err != nil {
		log.Fatal(err)
	}
	if err = tx.Commit(ctx); err != nil {
		log.Fatal(err)
	}
	fmt.Println("Administrator saved; previous sessions revoked:", *email)
}
