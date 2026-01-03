package repositories

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
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
