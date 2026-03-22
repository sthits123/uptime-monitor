package repositories

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/sthits123/uptime-monitor/internal/models"
)

type WebsiteTickRepo struct {
	db *pgxpool.Pool
}

func NewWebsiteTickRepo(db *pgxpool.Pool) *WebsiteTickRepo {
	return &WebsiteTickRepo{db: db}
}

func (r *WebsiteTickRepo) Insert(
	ctx context.Context,
	websiteID string,
	regionID string,
	responseTime int,
	status string,
	responseCode *int,
	errorMessage *string,
) error {

	_, err := r.db.Exec(ctx, `
		INSERT INTO website_tick (
			id,
			website_id,
			region_id,
			response_time_ms,
			status,
			response_code,
			error_message
		)
		VALUES (
			gen_random_uuid(),
			$1, $2, $3, $4, $5, $6
		)
	`,
		websiteID,
		regionID,
		responseTime,
		status,
		responseCode,
		errorMessage,
	)

	return err
}

func (r *WebsiteTickRepo) InsertUserTick(
	ctx context.Context,
	userID string,
	websiteID string,
	responseTime int,
	status string,
	responseCode *int,
	errorMessage *string,
) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO user_tick (
			id,
			user_id,
			website_id,
			response_time_ms,
			status,
			response_code,
			error_message
		)
		VALUES (
			gen_random_uuid(),
			$1, $2, $3, $4, $5, $6
		)
	`,
		userID,
		websiteID,
		responseTime,
		status,
		responseCode,
		errorMessage,
	)

	return err
}

func (r *WebsiteTickRepo) ListByWebsiteID(ctx context.Context, websiteID string, limit int) ([]models.WebsiteTick, error) {
	rows, err := r.db.Query(ctx, `
		SELECT t.id, t.website_id, t.region_id, t.response_time_ms, t.status, t.created_at
		FROM website_tick t
		WHERE t.website_id = $1
		ORDER BY t.created_at DESC
		LIMIT $2
	`, websiteID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ticks []models.WebsiteTick
	for rows.Next() {
		var t models.WebsiteTick
		if err := rows.Scan(
			&t.ID,
			&t.WebsiteID,
			&t.RegionID,
			&t.ResponseTimeMs,
			&t.Status,
			&t.CreatedAt,
		); err != nil {
			return nil, err
		}
		ticks = append(ticks, t)
	}
	return ticks, nil
}

func (r *WebsiteTickRepo) GetLatestTicksByRegion(ctx context.Context, websiteID string) ([]models.RegionalStatus, error) {
	rows, err := r.db.Query(ctx, `
		WITH LatestTicks AS (
			SELECT 
				region_id,
				status,
				response_time_ms,
				created_at,
				ROW_NUMBER() OVER(PARTITION BY region_id ORDER BY created_at DESC) as rn
			FROM website_tick
			WHERE website_id = $1
		),
		LatestTickPerRegion AS (
			SELECT 
				region_id,
				status,
				response_time_ms,
				created_at
			FROM LatestTicks
			WHERE rn = 1
		)
		SELECT 
			reg.name as region_name,
			CASE 
				WHEN lt.created_at IS NULL THEN 'unknown'
				WHEN lt.created_at < now() - interval '2 minutes' THEN 'unknown'
				ELSE lt.status::text
			END as status,
			CASE 
				WHEN lt.created_at IS NULL OR lt.created_at < now() - interval '2 minutes' THEN 0
				ELSE lt.response_time_ms
			END,
			COALESCE(lt.created_at, now())
		FROM region reg
		LEFT JOIN LatestTickPerRegion lt ON reg.id = lt.region_id
		ORDER BY reg.name ASC
	`, websiteID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var statuses []models.RegionalStatus
	for rows.Next() {
		var s models.RegionalStatus
		var statusStr string
		if err := rows.Scan(
			&s.RegionName,
			&statusStr,
			&s.ResponseTimeMs,
			&s.LastChecked,
		); err != nil {
			return nil, err
		}
		s.Status = models.WebsiteStatus(statusStr)
		statuses = append(statuses, s)
	}
	return statuses, nil
}

type RegionalTick struct {
	RegionID       string    `db:"region_id"`
	RegionName     string    `db:"region_name"`
	ResponseTimeMs int       `db:"response_time_ms"`
	Status         string    `db:"status"`
	CreatedAt      time.Time `db:"created_at"`
}

func (r *WebsiteTickRepo) GetRegionalHistory(ctx context.Context, websiteID string, limit int) ([]RegionalTick, error) {
	rows, err := r.db.Query(ctx, `
		SELECT 
			wt.region_id,
			COALESCE(reg.name, wt.region_id::text) as region_name,
			wt.response_time_ms,
			wt.status::text,
			wt.created_at
		FROM website_tick wt
		LEFT JOIN region reg ON wt.region_id = reg.id
		WHERE wt.website_id = $1
		ORDER BY wt.created_at DESC
		LIMIT $2
	`, websiteID, limit)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ticks []RegionalTick
	for rows.Next() {
		var t RegionalTick
		if err := rows.Scan(
			&t.RegionID,
			&t.RegionName,
			&t.ResponseTimeMs,
			&t.Status,
			&t.CreatedAt,
		); err != nil {
			return nil, err
		}
		ticks = append(ticks, t)
	}
	return ticks, nil
}
