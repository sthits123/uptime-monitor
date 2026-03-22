# 🚀 Uptime Monitor

A simple, production-ready uptime monitoring system. Track website availability and latency in real-time.

## ✨ Quick Start

The easiest way to run the project is using **Docker Compose**.

### Prerequisites
- [Docker & Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Clone & Run
```bash
git clone https://github.com/sthits123/uptime-monitor.git
cd uptime-monitor

# Build and start all services
docker compose up --build -d
```

### 2. Access
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8082](http://localhost:8082)
- **Database:** `localhost:5434` (User: `uptime`, Pass: `uptime123`)

---

## 🛠️ Local Development (Manual)

If you want to run services without Docker:

### Backend
1. Go to `apps/backend`
2. Run `go run cmd/api/main.go`
3. Run `go run cmd/pusher/main.go`
4. Run `REGION=global go run cmd/worker/main.go`

### Frontend
1. Go to `apps/frontend`
2. Run `bun install`
3. Run `bun run dev`

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL URL | `postgresql://...` |
| `REDIS_ADDR` | Redis address | `redis:6379` |
| `JWT_SECRET` | Auth secret | `dev-secret` |

## 📝 License
MIT License
