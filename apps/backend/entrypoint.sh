#!/bin/sh

# Run migrations
echo "Running database migrations..."
./tern migrate -m ./internal/database/migrations --conn-string "$DATABASE_URL"

# Execute the passed command
exec "$@"
