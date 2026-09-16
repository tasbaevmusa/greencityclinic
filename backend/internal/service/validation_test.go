package service

import (
	"health-plus/backend/internal/model"
	"testing"
)

func TestScheduleValidation(t *testing.T) {
	for _, tc := range []struct {
		name, date, kind, start, end string
		valid                        bool
	}{
		{"working day", "2026-09-16", "work", "08:00", "17:00", true},
		{"invalid hour", "2026-09-16", "work", "25:00", "26:00", false},
		{"reversed", "2026-09-16", "work", "17:00", "08:00", false},
		{"equal", "2026-09-16", "work", "08:00", "08:00", false},
		{"invalid day", "2026-02-30", "work", "08:00", "17:00", false},
		{"unknown type", "2026-09-16", "other", "08:00", "17:00", false},
		{"day off clears hours", "2026-09-16", "dayoff", "08:00", "17:00", true},
	} {
		t.Run(tc.name, func(t *testing.T) {
			s := model.Schedule{WorkDate: tc.date, Type: tc.kind, Start: &tc.start, End: &tc.end}
			err := ValidateSchedule(&s)
			if (err == nil) != tc.valid {
				t.Fatalf("unexpected validation: %v", err)
			}
			if tc.kind == "dayoff" && (s.Start != nil || s.End != nil) {
				t.Fatal("day off retained working hours")
			}
		})
	}
	if ValidateSchedule(&model.Schedule{WorkDate: "2026-09-16", Type: "work"}) == nil {
		t.Fatal("missing hours accepted")
	}
}

func TestDoctorValidation(t *testing.T) {
	if ValidateDoctor(model.Doctor{Name: " ", Position: "Doctor"}) == nil {
		t.Fatal("blank name accepted")
	}
	if err := ValidateDoctor(model.Doctor{Name: "Doctor", Position: "Therapist"}); err != nil {
		t.Fatal(err)
	}
}
