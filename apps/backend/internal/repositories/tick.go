package repositories

import (
	"context"

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
		)
		SELECT 
			reg.name as region_name,
			COALESCE(lt.status, 'unknown')::text,
			COALESCE(lt.response_time_ms, 0),
			COALESCE(lt.created_at, now())
		FROM region reg
		LEFT JOIN LatestTicks lt ON reg.id = lt.region_id AND lt.rn = 1
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
