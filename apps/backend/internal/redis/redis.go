package redis

import (
	"context"
	"crypto/tls"
	"github.com/redis/go-redis/v9"
	"log"
	"os"
)

const StreamName = "uptime_monitor"

func NewRedisClient(addr string) *redis.Client {

	password := os.Getenv("REDIS_PASSWORD")

	rdb := redis.NewClient(&redis.Options{
		Addr:      addr,
		Password:  password,
		TLSConfig: &tls.Config{MinVersion: tls.VersionTLS12},
	})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("redis connection failed: %v", err)
	}

	return rdb
}
