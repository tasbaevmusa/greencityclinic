FROM golang:1.23-alpine AS build
WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /health-plus-api ./cmd/server

FROM alpine:3.21
RUN adduser -D -H appuser
USER appuser
COPY --from=build /health-plus-api /health-plus-api
EXPOSE 8080
ENTRYPOINT ["/health-plus-api"]
