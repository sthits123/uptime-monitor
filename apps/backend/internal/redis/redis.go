package redis


import (
	"context"
	"log"
    "github.com/redis/go-redis/v9"
)

const StreamName = "uptime_monitor"

func NewRedisClient(addr string) *redis.Client {
	
	rdb := redis.NewClient(&redis.Options{
		Addr: addr,
	})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("redis connection failed: %v", err)
	}

	return rdb
}
