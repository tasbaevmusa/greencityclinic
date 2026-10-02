package model

type Content struct {
	ID             string `json:"id"`
	Title          string `json:"title,omitempty"`
	Category       string `json:"category,omitempty"`
	Description    string `json:"description,omitempty"`
	Source         string `json:"source,omitempty"`
	URL            string `json:"url,omitempty"`
	Name           string `json:"name,omitempty"`
	Date           string `json:"date,omitempty"`
	Rating         int    `json:"rating,omitempty"`
	Message        string `json:"message,omitempty"`
	Department     string `json:"department,omitempty"`
	Employment     string `json:"employment,omitempty"`
	Requirements   string `json:"requirements,omitempty"`
	Contact        string `json:"contact,omitempty"`
	Published      bool   `json:"published"`
	TranslationKey string `json:"translationKey,omitempty"`
}
