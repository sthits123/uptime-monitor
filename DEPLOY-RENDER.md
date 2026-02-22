# Deploy to Render (Free - No Credit Card)

This guide walks you through deploying your uptime monitor to Render's free tier.

## Architecture

You have 3 backend services + 1 frontend:

| Service | Purpose | Type |
|---------|---------|------|
| `api` | REST API server | Web Service |
| `pusher` | WebSocket/push notifications | Web Service |
| `worker` | Background uptime checker | Background Worker |
| `frontend` | React UI | Static Site |

---

## Prerequisites

- GitHub account
- Code pushed to a GitHub repository

---

## Step 1: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click **"Sign Up"** → Use **GitHub**
3. No credit card required for free tier

---

## Step 2: Create PostgreSQL Database

1. On Render dashboard, click **"New"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `uptime-postgres`
   - **Database**: `uptime_monitor`
   - **User**: `uptime`
   - **Password**: `uptime123` (or generate one)
3. Click **"Create Database"**
4. **Copy the "Internal Database URL"** (format: `postgres://user:password@host.internal:5432/database`)

---

## Step 3: Create Redis

1. Click **"New"** → **"Redis"**
2. Configure:
   - **Name**: `uptime-redis`
3. Click **"Create Redis"**
4. **Copy the "Internal Redis URL"** (format: `redis://redis-proxy-xxx.internal:6379`)

---

## Step 4: Deploy API Service

1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `uptime-api`
   - **Root Directory**: `apps/backend`
   - **Build Command**: `go build -o /api ./cmd/api`
   - **Start Command**: `/api`
4. Add Environment Variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | `postgres://user:password@host.internal:5432/uptime_monitor` |
   | `REDIS_ADDR` | `redis://host.internal:6379` |
   | `JWT_SECRET` | Generate a secure random string |
   | `PORT` | `8082` |
   | `FRONTEND_URL` | `https://uptime-frontend.onrender.com` (update later) |

5. Click **"Create Web Service"**
6. Wait for build to complete

---

## Step 5: Deploy Pusher Service

1. Click **"New"** → **"Web Service"**
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `uptime-pusher`
   - **Root Directory**: `apps/backend`
   - **Build Command**: `go build -o /pusher ./cmd/pusher`
   - **Start Command**: `/pusher`
4. Add Environment Variables (same as API):
   - `DATABASE_URL`
   - `REDIS_ADDR`
   - `REDIS_STREAM_UPTIME`: `uptime_monitor`
   - `REDIS_STREAM_NOTIFICATIONS`: `notification_events`
   - `REDIS_CONSUMER_GROUP`: `monitoring-workers`
5. Click **"Create Web Service"**

---

## Step 6: Deploy Worker Service

1. Click **"New"** → **"Background Worker"**
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `uptime-worker`
   - **Root Directory**: `apps/backend`
   - **Build Command**: `go build -o /worker ./cmd/worker`
   - **Start Command**: `/worker`
4. Add Environment Variables (same as API + worker config):
   - `DATABASE_URL`
   - `REDIS_ADDR`
   - `CHECK_INTERVAL_SECONDS`: `60`
   - `WORKER_COUNT`: `5`
   - `MONITORING_REGIONS`: `us-east-1,eu-west-1,ap-southeast-1`
   - `REDIS_STREAM_UPTIME`: `uptime_monitor`
   - `REDIS_CONSUMER_GROUP`: `monitoring-workers`
5. Click **"Create"**

---

## Step 7: Deploy Frontend

1. Click **"New"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `uptime-frontend`
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variables:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://uptime-api.onrender.com` |

5. Click **"Create Static Site"**
6. Wait for deployment to complete

---

## Step 8: Final Configuration

After frontend deploys:

1. Copy your frontend URL (e.g., `https://uptime-frontend.onrender.com`)
2. Go to **uptime-api** service → **"Environment"**
3. Update `FRONTEND_URL` to your frontend URL

---

## Important Notes

### Free Tier Limits
- **Web Services**: Sleep after 15 min of inactivity (cold start ~30s)
- **Background Workers**: Always running (no sleep)
- **PostgreSQL**: Free for 90 days, then $7/month
- **Redis**: Free for 30 days, then $7/month
- **Static Sites**: Unlimited for personal projects

### Keeping Services Awake
For free tier, services sleep after 15 minutes. Options:
- Use a free uptime monitor (like your own!) to ping your API every 5 minutes
- Use a service like [cron-job.org](https://cron-job.org) to ping your API

---

## Troubleshooting

### Build Failures
- Ensure Go version compatibility (1.25+)
- Check that the build command path is correct

### Database Connection Errors
- Verify DATABASE_URL is correct
- Make sure PostgreSQL is fully initialized

### 503 Errors After Deployment
- Wait a few minutes for services to start
- Check logs in Render dashboard

---

## Useful Links

- [Render Dashboard](https://dashboard.render.com)
- [Render Docs](https://render.com/docs)
- [Cron-job.org](https://cron-job.org) - Keep services awake
