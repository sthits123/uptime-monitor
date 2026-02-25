# 🚀 Free Deployment Guide (No Credit Card Required)

Follow this guide to host your Uptime Monitor for 100% free without ever providing a credit card.

## 🏗️ Services Checklist
- **Database**: [Supabase](https://supabase.com) (Free Postgres)
- **Redis**: [Upstash](https://upstash.com) (Free Redis)
- **Frontend**: [Vercel](https://vercel.com) (Free deployment)
- **Backend**: [Koyeb](https://koyeb.com) (Free "always-on" Go hosting)

---

## 1. 📂 Database (Supabase)
1. Go to [Supabase](https://supabase.com) and sign up with GitHub.
2. Create a new project.
3. Go to **Project Settings > Database**.
4. Copy the **Connection String** (URI). It will look like: 
   `postgresql://postgres.[ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=disable`
   > [!IMPORTANT]
   > Make sure to append `?sslmode=disable` at the end if you encounter connection issues, or use the appropriate SSL mode for Production.

## 2. ⚡ Redis (Upstash)
1. Go to [Upstash](https://upstash.com) and sign up.
2. Create a **Redis Database**.
3. Copy the **Endpoint** (looks like `redis://default:[PASSWORD]@[ID].upstash.io:[PORT]`).
   > [!NOTE]
   > For the Go backend, you usually just need the host:port part: `[ID].upstash.io:[PORT]`.

## 3. ⚙️ Backend (Koyeb)
We consolidated the API, Worker, and Pusher into a single **Monolith** to fit into Koyeb's free tier.

1. Go to [Koyeb](https://www.koyeb.com/) and sign up.
2. Click **Create Service**.
3. Connect your GitHub repository.
4. Set the **Build Command** to: `go build -o monolith ./cmd/monolith`
5. Set the **Run Command** to: `./monolith`
6. Add the following **Environment Variables**:
   - `DATABASE_URL`: (From Supabase)
   - `REDIS_ADDR`: (From Upstash)
   - `JWT_SECRET`: (Any secure long string)
   - `PORT`: `8080` (Koyeb will detect this)
   - `REGION`: `production`

## 4. 🖼️ Frontend (Vercel)
1. Go to [Vercel](https://vercel.com) and sign up.
2. Import your GitHub repository.
3. Select the `apps/frontend` directory as the project root.
4. Add the **Environment Variable**:
   - `VITE_API_URL`: (The URL Koyeb gives you, e.g., `https://[YOUR-APP].koyeb.app`)
5. Deploy!

---

## 🧪 Testing your Monolith locally
Before deploying, you can test the combined backend logic by running:
```bash
cd apps/backend
go run cmd/monolith/main.go
```
This will start the API, Pusher, and Worker all at once!
