package service

import (
	"fmt"
	"health-plus/backend/internal/model"
	"strings"
	"time"
)

func ValidateDoctor(d model.Doctor) error {
	if strings.TrimSpace(d.Name) == "" || strings.TrimSpace(d.Position) == "" {
		return fmt.Errorf("name and position are required")
	}
	return nil
}
func ValidDate(v string) bool { _, err := time.Parse("2006-01-02", v); return err == nil }
func ValidateSchedule(s *model.Schedule) error {
	if !ValidDate(s.WorkDate) || (s.Type != "work" && s.Type != "dayoff" && s.Type != "vacation") {
		return fmt.Errorf("invalid date or schedule type")
	}
	if s.Type != "work" {
		s.Start = nil
		s.End = nil
		return nil
	}
	if s.Start == nil || s.End == nil {
		return fmt.Errorf("work shift requires valid start and end times")
	}
	start, err := time.Parse("15:04", *s.Start)
	end, endErr := time.Parse("15:04", *s.End)
	if err != nil || endErr != nil || !end.After(start) {
		return fmt.Errorf("work shift requires valid start and end times")
	}
	return nil
}
