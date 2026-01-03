package workers

import (
	"context"
	"fmt"

	goredis "github.com/redis/go-redis/v9"
	"github.com/sthits123/uptime-monitor/internal/repositories"
)

func StartRegionWorkers(
	ctx context.Context,
	rdb *goredis.Client,
	tickRepo *repositories.WebsiteTickRepo,
	regionRepo *repositories.RegionRepo,
	region string,
	count int,
) {
	for i := 0; i < count; i++ {
		worker := &Worker{
			Redis:      rdb,
			TickRepo:   tickRepo,
			RegionRepo: regionRepo,
			Region:     region,
			Group:      region,
			Consumer:   fmt.Sprintf("%s-worker-%d", region, i),
		}

		go worker.Run(ctx)
	}
}
