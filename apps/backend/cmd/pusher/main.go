
package main

import (
	"context"
	"log"
	"time"
    "github.com/sthits123/uptime-monitor/internal/database"
	"github.com/sthits123/uptime-monitor/internal/repositories"
	"github.com/sthits123/uptime-monitor/internal/redis"
)

func main() {
	ctx := context.Background()

	db, err := database.New()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	rdb := redis.NewRedisClient("localhost:6379")

	websiteRepo := repositories.NewWebsiteRepo(db.Pool)

	ticker := time.NewTicker(3 * time.Minute)
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

