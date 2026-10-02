package service

import (
	"health-plus/backend/internal/model"
	"testing"
)

func TestContentValidation(t *testing.T) {
	for _, url := range []string{"javascript:alert(1)", "data:text/html,test", "/relative", "https://"} {
		if ValidateContent("news", model.Content{Title: "title", Category: "category", Description: "text", Source: "source", URL: url}) == nil {
			t.Errorf("accepted URL %s", url)
		}
	}
	for _, rating := range []int{-1, 0, 6, 100} {
		if ValidateContent("reviews", model.Content{Name: "name", Message: "message", Rating: rating}) == nil {
			t.Errorf("accepted rating %d", rating)
		}
	}
	if ValidateContent("vacancies", model.Content{Title: "only title"}) == nil {
		t.Fatal("accepted incomplete vacancy")
	}
	if ValidateContent("news", model.Content{Title: "title", Category: "category", Description: "text", Source: "source", URL: "https://example.com/news"}) != nil {
		t.Fatal("rejected valid news")
	}
}
