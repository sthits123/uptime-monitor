package workers

import (
	"context"

	goredis "github.com/redis/go-redis/v9"
	"github.com/sthits123/uptime-monitor/internal/redis"
)

func StartRegionWorkers(
	ctx context.Context,
	rdb *goredis.Client,
	region string,
	instances int,
) {

	if err := redis.EnsureGroup(ctx, rdb,redis.StreamName, region); err != nil {
		panic(err)
	}

	for i := 0; i < instances; i++ {
		worker := &Worker{
			Redis:    rdb,
			Group:    region,
			Consumer: region + "-" + string(rune(i)),
		}
		go worker.Run(ctx)
	}
}
