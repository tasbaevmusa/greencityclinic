# Go API НАРАМЕД

## Структура

```text
cmd/server/main.go           — точка входа (только запуск)
internal/
  app/                      — сборка зависимостей, HTTP-сервер, graceful shutdown
  config/                   — настройки окружения
  database/                 — подключение PostgreSQL, повторные попытки подключения
    migrations/             — SQL-схема, встроенная в бинарник через go:embed
  model/                    — структуры Doctor и Schedule, JSON-контракт
  repository/               — SQL-запросы к PostgreSQL
  service/                  — правила проверки врачей и расписаний
  handler/                  — HTTP-обработчики, маршруты, JSON-ответы
  middleware/               — CORS
```

`app` передаёт репозиторий обработчикам через интерфейс `handler.Store`.
Обработчики используют `service` для проверки данных и `repository` для хранения.
SQL отсутствует в HTTP-слое; `main.go` не знает о маршрутах и базе данных.

## Запуск

Из корня проекта при работающем Docker Desktop:

```powershell
docker compose up -d --build
```

Или запустите PostgreSQL отдельно и выполните из `backend`:

```powershell
$env:DATABASE_URL = 'postgres://myuser:mypassword@localhost:5432/mydb?sslmode=disable'
go run ./cmd/server
```

Настройки: `PORT` (8080), `DATABASE_URL`, `ALLOWED_ORIGINS` (localhost:3000 и
127.0.0.1:3000). `.env` автоматически читает Docker Compose; при запуске через
`go run` задайте переменные в окружении. Схема создаётся при старте без удаления
существующих таблиц и данных. При остановке сервер завершает текущие запросы
и закрывает пул соединений.

## API

| Метод | Путь |
| --- | --- |
| GET | `/health` |
| GET, POST | `/api/doctors` |
| GET, PUT, DELETE | `/api/doctors/{id}` |
| GET | `/api/schedules?from=YYYY-MM-DD&to=YYYY-MM-DD` |
| PUT, DELETE | `/api/doctors/{id}/schedules/{date}` |

Адреса и JSON-поля сохранены для текущего React-клиента.

## Проверки

```powershell
go test ./...
go vet ./...
go build ./...
```

Тесты проверяют HTTP-статусы, JSON, CORS и валидацию. Интеграционный тест проверяет
полный цикл CRUD врачей и расписаний на PostgreSQL. Для него создайте отдельную
тестовую базу и укажите её адрес:

```powershell
$env:TEST_DATABASE_URL = 'postgres://myuser:mypassword@localhost:5432/health_plus_test?sslmode=disable'
go test ./internal/handler -run TestPostgresAPI -v
```

Без `TEST_DATABASE_URL` этот тест пропускается. Он создаёт уникальную схему
`api_test_*` и удаляет только эту схему после завершения. Не используйте рабочую
базу в качестве тестовой.
