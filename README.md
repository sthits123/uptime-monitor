# 🚀 Uptime Monitor

A modern, full-stack uptime monitoring application that helps you track the availability and performance of your websites, APIs, and servers in real-time.


## ✨ Features

- **Real-time Monitoring**: Track website uptime with automated health checks
- **Instant Alerts**: Get notified immediately when your services go down
- **Beautiful Dashboard**: Modern, responsive UI with dark mode support
- **Multi-region Support**: Monitor from multiple geographic locations
- **Detailed Analytics**: View uptime statistics, response times, and incident history
- **RESTful API**: Built with Go for high performance and reliability
- **Secure Authentication**: JWT-based authentication system
- **Scalable Architecture**: Redis-backed job queue for distributed monitoring

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for blazing-fast development
- TailwindCSS 4 for modern styling
- Radix UI for accessible components
- React Query for data fetching
- React Router for navigation

**Backend:**
- Go 1.25.5
- PostgreSQL 16 for data persistence
- Redis 7 for job queuing and caching
- JWT for authentication
- Tern for database migrations

**Infrastructure:**
- Docker & Docker Compose
- Turbo for monorepo management
- Bun as package manager

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Go](https://golang.org/dl/) (1.25.5 or higher)
- [Bun](https://bun.sh/) (1.2.13 or higher)
- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Task](https://taskfile.dev/) (optional, for backend tasks)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sthits123/uptime-monitor.git
cd uptime-monitor
```

### 2. Start Infrastructure Services

Start PostgreSQL and Redis using Docker Compose:

```bash
docker compose up -d
```

This will start:
- PostgreSQL on port `5433`
- Redis on port `6378`

### 3. Setup Backend

```bash
cd apps/backend

# Copy environment variables
cp .env.sample .env

# Install Go dependencies
go mod download

# Run database migrations (requires Task)
task migrations:up

# Or manually with tern
tern migrate -m ./internal/database/migrations --conn-string "postgres://uptime:uptime123@localhost:5433/uptime_monitor?sslmode=disable"

# Start the API server
go run ./cmd/api/main.go
```

The backend API will be available at `http://localhost:8080`

### 4. Setup Frontend

```bash
cd apps/frontend

# Install dependencies
bun install

# Start development server
bun run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
uptime-monitor/
├── apps/
│   ├── backend/              # Go backend application
│   │   ├── cmd/
│   │   │   ├── api/         # API server
│   │   │   ├── pusher/      # Job pusher service
│   │   │   └── worker/      # Background worker
│   │   ├── internal/
│   │   │   ├── database/    # Database connection & migrations
│   │   │   ├── handlers/    # HTTP handlers
│   │   │   ├── middlewares/ # HTTP middlewares
│   │   │   ├── models/      # Data models
│   │   │   ├── redis/       # Redis client & queue
│   │   │   ├── repositories/# Data access layer
│   │   │   ├── utils/       # Utility functions
│   │   │   ├── validation/  # Request validation
│   │   │   └── workers/     # Background job workers
│   │   ├── go.mod
│   │   └── Taskfile.yml
│   └── frontend/            # React frontend application
│       ├── src/
│       │   ├── components/  # Reusable UI components
│       │   ├── pages/       # Page components
│       │   ├── hooks/       # Custom React hooks
│       │   ├── lib/         # Utility libraries
│       │   └── utils/       # Helper functions
│       ├── package.json
│       └── vite.config.ts
├── docker-compose.yml       # Docker services configuration
├── package.json            # Root package.json
├── turbo.json             # Turbo configuration
└── README.md              # This file
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in `apps/backend/` with the following variables:

```bash
# Database
DATABASE_URL="postgres://uptime:uptime123@localhost:5433/uptime_monitor?sslmode=disable"

# JWT Secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Redis
REDIS_URL="localhost:6378"

# Server
PORT=8080
```

### Frontend Configuration

The frontend automatically connects to the backend API at `http://localhost:8080`. To change this, update the API base URL in your frontend configuration.

## 🛠️ Development

### Available Scripts

**Root Level:**
```bash
bun run dev          # Start all services in development mode
bun run build        # Build all applications
bun run lint         # Lint all code
bun run typecheck    # Run TypeScript type checking
```

**Backend (apps/backend):**
```bash
task run                    # Run the API server
task migrations:new name=X  # Create a new migration
task migrations:up          # Apply migrations
task tidy                   # Format and tidy Go code
```

**Frontend (apps/frontend):**
```bash
bun run dev         # Start development server
bun run build       # Build for production
bun run preview     # Preview production build
bun run lint        # Lint code
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/signup` - Create a new user account
- `POST /api/v1/signin` - Sign in and get JWT token

### Websites (Protected)
- `GET /api/v1/websites` - List all monitored websites with current status
- `POST /api/v1/websites` - Add a new website to monitor
- `GET /api/v1/websites/{id}` - Get single website details
- `DELETE /api/v1/websites/{id}` - Remove a monitor and its history
- `GET /api/v1/websites/{id}/history` - Fetch check logs for uptime dots

### Health
- `GET /api/v1/healthcheck` - API health check

## 🎨 UI Features

- **Modern Design**: Clean, professional interface with glassmorphism effects
- **Dark Mode**: Full dark mode support with theme persistence
- **Responsive**: Mobile-first design that works on all devices
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Built with Radix UI for WCAG compliance

## 🔒 Security

- JWT-based authentication
- Argon2id password hashing
- CORS middleware for API protection
- Input validation on all endpoints
- SQL injection prevention with parameterized queries

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and authentication
- `websites` - Monitored websites/endpoints
- `ticks` - Health check results
- `regions` - Monitoring regions

Migrations are managed using [Tern](https://github.com/jackc/tern).

## 🚢 Deployment Guide

To deploy UptimeMonitor to your own VPS and domain (e.g., `UptimeMonitor.yourdomain.com`), follow this production checklist:

### 1. Backend Build
1. **Compile the binaries**:
   ```bash
   cd apps/backend
   go build -o api ./cmd/api
   go build -o worker ./cmd/worker
   go build -o pusher ./cmd/pusher
   ```
2. **Configure Services**:
   Use `systemd` to keep the processes running. Create service files in `/etc/systemd/system/` (e.g., `UptimeMonitor-api.service`).
   ```ini
   [Service]
   ExecStart=/path/to/api
   WorkingDirectory=/path/to/backend
   EnvironmentFile=/path/to/backend/.env
   Restart=always
   ```

### 2. Frontend Build
1. **Generate static files**:
   ```bash
   cd apps/frontend
   bun install
   bun run build
   ```
2. **Deploy to Nginx**:
   Point your Nginx root to the `apps/frontend/dist` folder.

### 3. Nginx Reverse Proxy
Configure Nginx to handle both the frontend and the backend API proxying.
```nginx
server {
    listen 80;
    server_name UptimeMonitor.yourdomain.com;

    location / {
        root /var/www/UptimeMonitor/frontend;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080;
    }
}
```

### 4. SSL Configuration
Run Certbot to automate SSL setup:
```bash
sudo certbot --nginx -d UptimeMonitor.yourdomain.com
```

### 5. Production Environment Variables
*   `VITE_API_URL`: Set to `https://UptimeMonitor.yourdomain.com` (no trailing slash).
*   `JWT_SECRET`: Generate a cryptographically secure key.
*   `DATABASE_URL`: Ensure your production PostgreSQL is accessible.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Sthita**
- GitHub: [@sthits123](https://github.com/sthits123)

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible components
- [TailwindCSS](https://tailwindcss.com/) for utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) for component inspiration
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using Go and React**
