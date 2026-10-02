package service

import (
	"fmt"
	"health-plus/backend/internal/model"
	"net/url"
	"regexp"
	"strings"
)

var contentID = regexp.MustCompile(`^[a-zA-Z0-9_-]{1,80}$`)

func ValidContentKind(kind string) bool {
	return kind == "news" || kind == "reviews" || kind == "vacancies"
}
func ValidContentID(id string) bool { return contentID.MatchString(id) }
func ValidateContent(kind string, c model.Content) error {
	if !ValidContentKind(kind) {
		return fmt.Errorf("unknown content type")
	}
	if c.ID != "" && !ValidContentID(c.ID) {
		return fmt.Errorf("invalid content id")
	}
	for _, value := range []string{c.Title, c.Category, c.Description, c.Source, c.URL, c.Name, c.Date, c.Message, c.Department, c.Employment, c.Requirements, c.Contact} {
		if len(value) > 20000 {
			return fmt.Errorf("Текст слишком длинный (максимум 20000 байт на поле)")
		}
	}
	var required []string
	switch kind {
	case "news":
		required = []string{c.Title, c.Category, c.Description, c.Source, c.URL}
		u, err := url.Parse(c.URL)
		if err != nil || u.Host == "" || u.User != nil || (u.Scheme != "https" && u.Scheme != "http") {
			return fmt.Errorf("Ссылка должна начинаться с https:// или http://")
		}
	case "reviews":
		required = []string{c.Name, c.Message}
		if c.Rating < 1 || c.Rating > 5 {
			return fmt.Errorf("Оценка должна быть от 1 до 5")
		}
	case "vacancies":
		required = []string{c.Title, c.Department, c.Employment, c.Description, c.Requirements, c.Contact}
	}
	for _, value := range required {
		if strings.TrimSpace(value) == "" {
			return fmt.Errorf("Заполните обязательные поля")
		}
	}
	return nil
}
