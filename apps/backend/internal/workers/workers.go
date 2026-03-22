package workers

import (
	"context"
	"log"

	goredis "github.com/redis/go-redis/v9"
	"github.com/sthits123/uptime-monitor/internal/redis"
	"github.com/sthits123/uptime-monitor/internal/repositories"
)

type Worker struct {
	Redis      *goredis.Client
	Group      string
	Consumer   string
	TickRepo   *repositories.WebsiteTickRepo
	RegionRepo *repositories.RegionRepo
	Region     string
}

func (w *Worker) Run(ctx context.Context) {
	for {
		messages, err := redis.XReadGroup(
			ctx,
			w.Redis,
			w.Group,
			w.Consumer,
			5,
		)

		if err != nil {
			if ctx.Err() != nil {
				return // Exit loop if context was canceled
			}
			log.Print(err)
			continue
		}

		var ackIDs []string

		for _, msg := range messages {
			log.Printf("[%s] checking website: %s (id: %s)", w.Region, msg.Payload.URL, msg.Payload.ID)
			result := CheckWebsite(msg.Payload.URL, msg.Payload.ID)

			regionID, err := w.RegionRepo.EnsureExists(ctx, w.Region)
			if err != nil {
				log.Println("failed to ensure region exists:", err)
				ackIDs = append(ackIDs, msg.ID)
				continue
			}

			err = w.TickRepo.Insert(
				ctx,
				result.WebsiteID,
				regionID,
				result.ResponseTime,
				result.Status,
				result.ResponseCode,
				result.ErrorMessage,
			)

			if err != nil {
				log.Println("insert website_tick failed:", err)
				continue
			}

			log.Printf("[%s] tick stored for %s: status=%s, response_time=%dms",
				w.Region, result.WebsiteID, result.Status, result.ResponseTime)

			ackIDs = append(ackIDs, msg.ID)
		}
		_ = redis.XAckBulk(ctx, w.Redis, w.Group, ackIDs)
	}
}
