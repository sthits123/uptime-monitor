# Deployment Guide (Free Tier - No Credit Card)

This guide covers deploying the uptime monitor using free-tier services.

## Prerequisites

- GitHub account
- Free accounts on selected services below

---

## Step 1: Database (PostgreSQL) - Already Configured ✅

You're using **Neon** (neon.tech) which has a free tier:
- 0.5GB storage
- 1 project
- No credit card required

Your connection string is already in `.env`.

---

## Step 2: Redis - Already Configured ✅

You're using **Upstash** which has a free tier:
- 10K commands/day
- 256MB storage
- No credit card required

Your Redis credentials are already in `.env`.

---

## Step 3: Deploy Backend (Choose One)

### Option A: Render (Recommended - Truly Free)

1. Sign up at [render.com](https://render.com) with GitHub
2. Connect your GitHub repository
3. Create a new **Web Service**:
   - Name: `uptime-pusher` and `uptime-worker` (create separate services)
   - Branch: `main`
   - Build Command: `go build -o pusher cmd/pusher/main.go`
   - Start Command: `./pusher`
   - Free Instance Type

4. Add Environment Variables in Render dashboard:
   ```
   DATABASE_URL=your_neon_connection_string
   REDIS_ADDR=your_upstash_addr
   REDIS_PASSWORD=your_upstash_password
   ```

5. For worker, create another service:
   - Build Command: `go build -o worker cmd/worker/main.go`
   - Start Command: `./worker`
   - Environment Variables: Add `REGION=asia` (or other regions)

### Option B: Fly.io

1. Install Fly CLI: `brew install flyctl` (macOS) or `curl -L https://fly.io/install.sh | sh`
2. Sign up: `fly auth signup`
3. Create app: `fly launch --name uptime-monitor`
4. Set secrets:
   ```
   fly secrets set DATABASE_URL="your_neon_url"
   fly secrets set REDIS_ADDR="your_upstash_addr"
   fly secrets set REDIS_PASSWORD="your_upstash_password"
   ```
5. Deploy: `fly deploy`

### Option C: Railway (May require card for verification)

1. Sign up at [railway.app](https://railway.app)
2. Connect GitHub repo
3. Create new project > Deploy from GitHub repo
4. Add environment variables

---

## Step 4: Deploy Frontend (Optional)

### Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Import your frontend repository
3. Add environment variable: `VITE_API_URL=your_backend_url`
4. Deploy

### Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your frontend build folder
3. Set environment variables

---

## Quick Start Commands

```bash
# Run locally
go run cmd/api/main.go          # API server
go run cmd/pusher/main.go       # Pushes websites to Redis
REGION=asia go run cmd/worker/main.go   # Worker for Asia
REGION=europe go run cmd/worker/main.go  # Worker for Europe

# Or use Makefile
make run
make pusher
make worker REGION=asia
```

---

## Free Tier Limits

| Service      | Free Tier Limits                          |
|--------------|-------------------------------------------|
| Neon         | 0.5GB storage, 1 project                  |
| Upstash      | 10K commands/day, 256MB                   |
| Render       | 750 hours/month, sleeps after 15 min     |
| Fly.io       | 3 shared VMs, 160GB outbound             |
| Vercel       | 100GB bandwidth, 6K builds/month         |

---

## Troubleshooting

### Worker not processing
- Check if pusher is running and pushing to Redis
- Verify Redis credentials are set in worker environment
- Check worker logs in deployment dashboard

### Database connection timeout
- Ensure DATABASE_URL is correct
- Neon may pause after 5 days of inactivity - log in to unfreeze

### Redis connection error
- Verify REDIS_ADDR and REDIS_PASSWORD
- Upstash free tier has daily command limits
