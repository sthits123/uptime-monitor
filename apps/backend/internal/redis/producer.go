package redis

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type WebsiteEvent struct {
	ID  string
	URL string
}

func XAdd(ctx context.Context, rdb *redis.Client, event WebsiteEvent) error {
	return rdb.XAdd(ctx, &redis.XAddArgs{
		Stream: StreamName,
		Values: map[string]interface{}{
			"id":  event.ID,
			"url": event.URL,
		},
	}).Err()
}
