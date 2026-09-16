package repository

import (
	"context"
	"errors"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"health-plus/backend/internal/model"
	"strings"
)

var ErrNotFound = errors.New("doctor not found")

type Postgres struct{ db *pgxpool.Pool }

func New(db *pgxpool.Pool) *Postgres { return &Postgres{db: db} }
func mapError(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	return err
}
func (p *Postgres) ListDoctors(ctx context.Context) ([]model.Doctor, error) {
	rows, err := p.db.Query(ctx, `SELECT id, name, position, description, image, created_at, updated_at FROM doctors ORDER BY created_at`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []model.Doctor{}
	for rows.Next() {
		var d model.Doctor
		if err := rows.Scan(&d.ID, &d.Name, &d.Position, &d.Description, &d.Image, &d.CreatedAt, &d.UpdatedAt); err != nil {
			return nil, err
		}
		items = append(items, d)
	}
	return items, rows.Err()
}
func (p *Postgres) GetDoctor(ctx context.Context, id string) (model.Doctor, error) {
	var d model.Doctor
	err := p.db.QueryRow(ctx, `SELECT id, name, position, description, image, created_at, updated_at FROM doctors WHERE id=$1`, id).Scan(&d.ID, &d.Name, &d.Position, &d.Description, &d.Image, &d.CreatedAt, &d.UpdatedAt)
	return d, mapError(err)
}
func normalize(d *model.Doctor) {
	d.Name = strings.TrimSpace(d.Name)
	d.Position = strings.TrimSpace(d.Position)
	d.Description = strings.TrimSpace(d.Description)
}
func (p *Postgres) CreateDoctor(ctx context.Context, d model.Doctor) (model.Doctor, error) {
	normalize(&d)
	err := p.db.QueryRow(ctx, `INSERT INTO doctors (name, position, description, image) VALUES ($1,$2,$3,$4) RETURNING id, created_at, updated_at`, d.Name, d.Position, d.Description, d.Image).Scan(&d.ID, &d.CreatedAt, &d.UpdatedAt)
	return d, err
}
func (p *Postgres) UpdateDoctor(ctx context.Context, id string, d model.Doctor) (model.Doctor, error) {
	normalize(&d)
	err := p.db.QueryRow(ctx, `UPDATE doctors SET name=$1, position=$2, description=$3, image=$4, updated_at=NOW() WHERE id=$5 RETURNING id, created_at, updated_at`, d.Name, d.Position, d.Description, d.Image, id).Scan(&d.ID, &d.CreatedAt, &d.UpdatedAt)
	return d, mapError(err)
}
func (p *Postgres) DeleteDoctor(ctx context.Context, id string) error {
	result, err := p.db.Exec(ctx, `DELETE FROM doctors WHERE id=$1`, id)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}
func (p *Postgres) ListSchedules(ctx context.Context, from, to string) ([]model.Schedule, error) {
	rows, err := p.db.Query(ctx, `SELECT id, doctor_id, work_date::text, type, start_time::text, end_time::text, note FROM doctor_schedules WHERE work_date BETWEEN $1 AND $2 ORDER BY doctor_id, work_date`, from, to)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []model.Schedule{}
	for rows.Next() {
		var s model.Schedule
		if err := rows.Scan(&s.ID, &s.DoctorID, &s.WorkDate, &s.Type, &s.Start, &s.End, &s.Note); err != nil {
			return nil, err
		}
		trimTime(&s)
		items = append(items, s)
	}
	return items, rows.Err()
}
func (p *Postgres) UpsertSchedule(ctx context.Context, s model.Schedule) (model.Schedule, error) {
	s.Note = strings.TrimSpace(s.Note)
	err := p.db.QueryRow(ctx, `INSERT INTO doctor_schedules (doctor_id, work_date, type, start_time, end_time, note) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (doctor_id, work_date) DO UPDATE SET type=EXCLUDED.type, start_time=EXCLUDED.start_time, end_time=EXCLUDED.end_time, note=EXCLUDED.note RETURNING id`, s.DoctorID, s.WorkDate, s.Type, s.Start, s.End, s.Note).Scan(&s.ID)
	return s, err
}
func (p *Postgres) DeleteSchedule(ctx context.Context, id, date string) error {
	_, err := p.db.Exec(ctx, `DELETE FROM doctor_schedules WHERE doctor_id=$1 AND work_date=$2`, id, date)
	return err
}
func trimTime(s *model.Schedule) {
	if s.Start != nil && len(*s.Start) >= 5 {
		v := (*s.Start)[:5]
		s.Start = &v
	}
	if s.End != nil && len(*s.End) >= 5 {
		v := (*s.End)[:5]
		s.End = &v
	}
}
