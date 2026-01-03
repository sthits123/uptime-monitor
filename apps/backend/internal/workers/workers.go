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
			log.Print(err)
			continue
		}

		var ackIDs []string

		for _, msg := range messages {
			result := CheckWebsite(msg.Payload.URL, msg.Payload.ID)

			// Get region to get region_id UUID
			regionID, err := w.RegionRepo.GetByName(ctx, w.Region)
			if err != nil {
				log.Println("failed to get region:", err)
				ackIDs = append(ackIDs, msg.ID)
				continue
			}

			// Insert into website_tick table
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
			ackIDs = append(ackIDs, msg.ID)
		}
		_ = redis.XAckBulk(ctx, w.Redis, w.Group, ackIDs)

	}
}
