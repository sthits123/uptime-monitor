package main

import (
	"context"
	"log"
	"os"
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
		addr = "localhost:6378"
	}

	db, err := database.New()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	rdb := redis.NewRedisClient(addr)

	websiteRepo := repositories.NewWebsiteRepo(db.Pool)

	ticker := time.NewTicker(10 * time.Second)
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
