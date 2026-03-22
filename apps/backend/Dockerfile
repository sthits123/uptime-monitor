# Build Stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

# Install tern migration tool
RUN GOBIN=/app go install github.com/jackc/tern/v2@latest

COPY . .

# Build all three components
RUN CGO_ENABLED=0 GOOS=linux go build -o api ./cmd/api
RUN CGO_ENABLED=0 GOOS=linux go build -o pusher ./cmd/pusher
RUN CGO_ENABLED=0 GOOS=linux go build -o worker ./cmd/worker

# Production Stage
FROM alpine:latest

WORKDIR /app

# Copy binaries and tool from builder
COPY --from=builder /app/api .
COPY --from=builder /app/pusher .
COPY --from=builder /app/worker .
COPY --from=builder /app/tern .

# Copy migrations and entrypoint
COPY internal/database/migrations ./internal/database/migrations
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Default port for API
EXPOSE 8082

ENTRYPOINT ["./entrypoint.sh"]
CMD ["./api"]
