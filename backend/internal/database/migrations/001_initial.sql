
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS doctor_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  work_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('work', 'dayoff', 'vacation')),
  start_time TIME,
  end_time TIME,
  note TEXT NOT NULL DEFAULT '',
  UNIQUE (doctor_id, work_date),
  CHECK (type <> 'work' OR (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time))
);
CREATE INDEX IF NOT EXISTS idx_schedules_work_date ON doctor_schedules(work_date);
ALTER TABLE doctors ALTER COLUMN whatsapp SET DEFAULT '';
