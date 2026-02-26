package main

import (
	"context"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/sthits123/uptime-monitor/internal/database"
	"github.com/sthits123/uptime-monitor/internal/redis"
	"github.com/sthits123/uptime-monitor/internal/repositories"
)

func main() {
	_ = godotenv.Overload()
	ctx := context.Background()

	addr := os.Getenv("REDIS_ADDR")
	if addr == "" {
		addr = "localhost:6379"
	}

	pushInterval := 60
	if interval := os.Getenv("PUSH_INTERVAL_SECONDS"); interval != "" {
		if parsed, err := strconv.Atoi(interval); err == nil && parsed > 0 {
			pushInterval = parsed
		}
	}

	db, err := database.New()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	rdb := redis.NewRedisClient(addr)

	websiteRepo := repositories.NewWebsiteRepo(db.Pool)

	log.Printf("Starting pusher with %d second interval", pushInterval)
	ticker := time.NewTicker(time.Duration(pushInterval) * time.Second)
	defer ticker.Stop()

	push := func() {
		websites, err := websiteRepo.ListAll(ctx)
		if err != nil {
			log.Println("fetch websites failed:", err)
			return
		}

		for _, w := range websites {
			err := redis.XAdd(ctx, rdb, redis.WebsiteEvent{
				ID:  w.ID,
				URL: w.URL,
			})
			if err != nil {
				log.Println("redis xadd failed:", err)
			}
		}

		log.Printf("pushed %d websites\n", len(websites))
	}

	push()

	for range ticker.C {
		push()
	}
}
