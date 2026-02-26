# Build Stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o api ./cmd/api

# Production
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/api .

EXPOSE 8082

CMD ["./api"]
