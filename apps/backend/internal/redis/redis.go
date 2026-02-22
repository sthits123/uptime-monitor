package redis

import (
	"context"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

const StreamName = "uptime_monitor"

func NewRedisClient(addr string) *redis.Client {

	password := os.Getenv("REDIS_PASSWORD")

	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
	})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("redis connection failed: %v", err)
	}

	return rdb
}
