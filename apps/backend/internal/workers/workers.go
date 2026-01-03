package workers

import (
	"context"
	"log"
    goredis "github.com/redis/go-redis/v9"
	"github.com/sthits123/uptime-monitor/internal/redis"
)


type Worker struct {
	Redis    *goredis.Client
	Group    string
	Consumer string
}

func (w *Worker) Run(ctx context.Context) {
   
	for {
		
		messages,err:=redis.XReadGroup(
			ctx,
			w.Redis,
			w.Group,
			w.Consumer,
			5,
		)
		
		if err!=nil{
			log.Print(err)
			continue
		}

		
		var ackIDs []string

		for _, msg := range messages {
			status, latency := CheckWebsite(msg.Payload.URL)

			log.Printf(
				"[group=%s] %s → %s (%dms)",
				w.Group,
				msg.Payload.URL,
				status,
				latency,
			)

			

			ackIDs = append(ackIDs, msg.ID)
		}

		if len(ackIDs) > 0 {
			if err := redis.XAckBulk(ctx, w.Redis, w.Group, ackIDs); err != nil {
				log.Println("ack error:", err)
			}
		}
	}
}