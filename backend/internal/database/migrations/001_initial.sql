
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

-- Initial clinic staff. Descriptions and photos can be filled in later from
-- the admin panel. The name check keeps this seed idempotent for existing
-- installations where the schema is applied again on every API start.
INSERT INTO doctors (name, position, description, image)
SELECT seed.name, seed.position, '', ''
FROM (VALUES
  ('НҰРМАХАН АЙЫМГҮЛ САҒАТҚЫЗЫ', 'Врач ЭХОКГ'),
  ('ЖОЛДАСОВА ЭЛЬМИРА САПАРБАЕВНА', 'Врач УЗИ'),
  ('МАДРАИМОВА КУЛЯШ БИЛАЛОВНА', 'Врач УЗИ'),
  ('ШУДАБАЕВА МЕРУЕРТ ШАКЕНОВНА', 'Врач УЗИ'),
  ('ДОЛАЕВ ЖАРАС АСХАТҰЛЫ', 'Ангиохирург'),
  ('ТАШПУЛАТОВ БАХТИЯР АЗАТОВИЧ', 'Ангиохирург'),
  ('БАХЫТЖАН МАДИНА БОЛАТҚЫЗЫ', 'Гастроэнтеролог'),
  ('ЖУМАБАЕВА АЙМЕРЕКЕ ЕРТАЛГАРБЕКОВНА', 'Детский гастроэнтеролог'),
  ('АЙТИКЕНОВА ЛЯЗЗАТ ОЙРАТОВНА', 'Офтальмолог'),
  ('ХАЗИЕВА НАЗУГУМ ОМАРЖАНОВНА', 'Офтальмолог'),
  ('МЕЙРАМБАЙ ЖАННА ЮГДАНҚЫЗЫ', 'Аритмолог'),
  ('МУКАШОВА АЙЖАН ЕРКІНҚЫЗЫ', 'Нефролог'),
  ('РАЙХАН ТӨЛЕГЕН БАҒДАТҰЛЫ', 'Гематолог'),
  ('СЫЗДЫКОВА АЙЫМ НУРЖАНОВНА', 'Гематолог'),
  ('АГАДАДИЕВА ЭЛЬМИРА ХАМИТОВНА', 'Эндокринолог'),
  ('УТЕНОВА АЗИЗА РАЗАКОВНА', 'Гинеколог'),
  ('АЛЬЖАНОВА ГАУҺАР ШАЛАБАЙҚЫЗЫ', 'Детский невропатолог'),
  ('РЫСБАЕВА АЙДАНА САҒИДУЛЛАҚЫЗЫ', 'Взрослый невропатолог'),
  ('ЫДЫРЫС ҰЛШАЙ БАТЫРХАНҚЫЗЫ', 'Пульмонолог'),
  ('ҚАБДРАШ ЖАҢЫЛСЫН ҚУАНБЕКҚЫЗЫ', 'Врач общей практики'),
  ('ШӘМШІ АЖАР МАРАТҚЫЗЫ', 'Врач общей практики')
) AS seed(name, position)
WHERE NOT EXISTS (
  SELECT 1 FROM doctors existing WHERE lower(existing.name) = lower(seed.name)
);
