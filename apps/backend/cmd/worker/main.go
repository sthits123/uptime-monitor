package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	goredis "github.com/redis/go-redis/v9"
	"github.com/sthits123/uptime-monitor/internal/redis"
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

	rdb := goredis.NewClient(&goredis.Options{
		Addr: addr,
	})

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	
	if err := redis.EnsureGroup(ctx, rdb, "uptime_monitor", region); err != nil {
		log.Fatal(err)
	}

	workers.StartRegionWorkers(ctx, rdb, region, count)

	log.Printf("workers running (region=%s, count=%d)", region, count)

	// Graceful shutdown
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig

	log.Println("shutting down workers...")
	cancel()
}
