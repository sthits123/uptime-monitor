package redis

import (
	"context"
	"errors"
	"fmt"
    "github.com/redis/go-redis/v9"
)

type Message struct {
	ID      string
	Payload WebsiteEvent
}

func XReadGroup(
	ctx context.Context,
	rdb *redis.Client,
	group string,
	consumer string,
	count int64,
) ([]Message, error) {

	cmd := rdb.XReadGroup(ctx, &redis.XReadGroupArgs{
		Group:    group,
		Consumer: consumer,
		Streams:  []string{StreamName, ">"},
		Count:    count,
		Block:    0,
	})

	if err := cmd.Err(); err != nil {
		if errors.Is(err, redis.Nil) {
			return nil, nil
		}
		return nil, err
	}

	var out []Message

	for _, stream := range cmd.Val() {
		for _, msg := range stream.Messages {

			id, ok1 := msg.Values["id"].(string)
			url, ok2 := msg.Values["url"].(string)

			if !ok1 || !ok2 {
				return nil, fmt.Errorf("invalid message payload: %+v", msg.Values)
			}

			out = append(out, Message{
				ID: msg.ID, // ✅ CORRECT MESSAGE ID
				Payload: WebsiteEvent{
					ID:  id,
					URL: url,
				},
			})
		}
	}

	return out, nil
}


func XAckBulk(
	ctx context.Context,
	rdb *redis.Client,
	group string,
	ids []string,
) error {
	if len(ids) == 0 {
		return nil
	}
	return rdb.XAck(ctx, StreamName, group, ids...).Err()
}