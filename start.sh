#!/bin/bash

# Uptime Monitor - Quick Start Script
# This script helps you get the project running quickly

set -e

echo "🚀 Uptime Monitor - Quick Start"
echo "================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start infrastructure services
echo "📦 Starting PostgreSQL and Redis..."
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

echo "✅ Infrastructure services started"
echo ""
echo "📊 Service Status:"
echo "  - PostgreSQL: localhost:5433"
echo "  - Redis: localhost:6378"
echo ""

# Check if backend .env exists
if [ ! -f "apps/backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp apps/backend/.env.sample apps/backend/.env
    echo "✅ Created apps/backend/.env"
    echo "⚠️  Please update JWT_SECRET in apps/backend/.env before production use!"
    echo ""
fi

echo "🎯 Next Steps:"
echo ""
echo "1. Start the Backend API:"
echo "   cd apps/backend"
echo "   go run ./cmd/api/main.go"
echo ""
echo "2. Start the Frontend (in a new terminal):"
echo "   cd apps/frontend"
echo "   bun run dev"
echo ""
echo "3. (Optional) Start the Worker (in a new terminal):"
echo "   cd apps/backend"
echo "   go run ./cmd/worker/main.go"
echo ""
echo "4. (Optional) Start the Pusher (in a new terminal):"
echo "   cd apps/backend"
echo "   go run ./cmd/pusher/main.go"
echo ""
echo "📖 Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:8080"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "✨ Happy monitoring!"
