package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	"github.com/sthits123/uptime-monitor/internal/database"
	goredis "github.com/sthits123/uptime-monitor/internal/redis"
	"github.com/sthits123/uptime-monitor/internal/repositories"
	"github.com/sthits123/uptime-monitor/internal/workers"
)

func main() {
	region := os.Getenv("REGION")
	if region == "" {
		region = "local"
	}

	count, _ := strconv.Atoi(os.Getenv("WORKERS"))
	if count <= 0 {
		count = 2
	}

	addr := os.Getenv("REDIS_ADDR")
	if addr == "" {
		addr = "localhost:6379"
	}

	db, err := database.New()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	tickRepo := repositories.NewWebsiteTickRepo(db.Pool)
	regionRepo := repositories.NewRegionRepo(db.Pool)

	rdb := goredis.NewRedisClient(addr)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Group per region
	if err := goredis.EnsureGroup(ctx, rdb, goredis.StreamName, region); err != nil {
		log.Fatal(err)
	}

	workers.StartRegionWorkers(
		ctx,
		rdb,
		tickRepo,
		regionRepo,
		region,
		count,
	)

	log.Printf("workers running (region=%s, count=%d)", region, count)

	// Graceful shutdown
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig

	log.Println("shutting down workers...")
	cancel()
}
