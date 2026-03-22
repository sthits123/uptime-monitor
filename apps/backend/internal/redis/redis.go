package redis

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

const StreamName = "uptime_monitor"

func NewRedisClient(addr string) *redis.Client {
	opts, err := redis.ParseURL(addr)
	if err != nil {

		log.Fatal("Error connecting to redis: ", err)
	}

	rdb := redis.NewClient(opts)

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("redis connection failed: %v", err)
	}

	return rdb
}
