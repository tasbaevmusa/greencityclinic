package model

import "time"

type Doctor struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Position    string    `json:"position"`
	Description string    `json:"description"`
	Image       string    `json:"image"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Schedule struct {
	ID       string  `json:"id"`
	DoctorID string  `json:"doctor_id"`
	WorkDate string  `json:"work_date"`
	Type     string  `json:"type"`
	Start    *string `json:"start"`
	End      *string `json:"end"`
	Note     string  `json:"note"`
}
