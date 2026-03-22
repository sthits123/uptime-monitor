package repositories

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/sthits123/uptime-monitor/internal/models"
)

type WebsiteRepo struct {
	db *pgxpool.Pool
}

func NewWebsiteRepo(db *pgxpool.Pool) *WebsiteRepo {
	return &WebsiteRepo{db: db}
}

func (r *WebsiteRepo) Create(ctx context.Context, w models.Website) error {
	query := `
		INSERT INTO website (id, url, user_id, time_added)
		VALUES ($1, $2, $3, $4)
	`
	_, err := r.db.Exec(
		ctx,
		query,
		w.ID,
		w.URL,
		w.UserID,
		w.TimeAdded,
	)
	if err != nil {
		return fmt.Errorf("failed to create website: %w", err)
	}

	return nil
}

func (r *WebsiteRepo) FindByID(ctx context.Context, userID, websiteID string) (*models.Website, error) {
	query := `
		SELECT id, url, user_id, time_added
		FROM website
		WHERE id = $1 AND user_id = $2
		LIMIT 1
	`

	row := r.db.QueryRow(ctx, query, websiteID, userID)

	var w models.Website
	if err := row.Scan(&w.ID, &w.URL, &w.UserID, &w.TimeAdded); err != nil {
		if err.Error() == "no rows in result set" {
			return nil, fmt.Errorf("website not found")
		}
		return nil, fmt.Errorf("failed to query website: %w", err)
	}

	return &w, nil
}

func (r *WebsiteRepo) ListAll(ctx context.Context) ([]models.Website, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, url
		FROM website
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var websites []models.Website

	for rows.Next() {
		var w models.Website
		if err := rows.Scan(&w.ID, &w.URL); err != nil {
			return nil, err
		}
		websites = append(websites, w)
	}

	return websites, nil
}

func (r *WebsiteRepo) ListByUserID(ctx context.Context, userID string) ([]models.Website, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, url, user_id, time_added
		FROM website
		WHERE user_id = $1
		ORDER BY time_added DESC
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var websites []models.Website

	for rows.Next() {
		var w models.Website
		if err := rows.Scan(&w.ID, &w.URL, &w.UserID, &w.TimeAdded); err != nil {
			return nil, err
		}
		websites = append(websites, w)
	}

	return websites, nil
}

func (r *WebsiteRepo) FindByWebsiteID(ctx context.Context, websiteID string) (*models.Website, error) {
	query := `
		SELECT id, url, user_id, time_added
		FROM website
		WHERE id = $1
		LIMIT 1
	`

	row := r.db.QueryRow(ctx, query, websiteID)

	var w models.Website
	if err := row.Scan(&w.ID, &w.URL, &w.UserID, &w.TimeAdded); err != nil {
		if err.Error() == "no rows in result set" {
			return nil, fmt.Errorf("website not found")
		}
		return nil, fmt.Errorf("failed to query website: %w", err)
	}

	return &w, nil
}

type WebsiteWithStatus struct {
	ID            string     `json:"id"`
	URL           string     `json:"url"`
	UserID        string     `json:"user_id"`
	TimeAdded     time.Time  `json:"time_added"`
	Status        *string    `json:"status"`
	ResponseTime  *int       `json:"response_time_ms"`
	ResponseCode  *int       `json:"response_code"`
	LastCheckedAt *time.Time `json:"last_checked_at"`
}

func (r *WebsiteRepo) ListByUserIDWithStatus(ctx context.Context, userID string) ([]WebsiteWithStatus, error) {
	query := `
		SELECT 
			w.id,
			w.url,
			w.user_id,
			w.time_added,
			wt.status,
			wt.response_time_ms,
			wt.response_code,
			wt.created_at as last_checked_at
		FROM website w
		LEFT JOIN LATERAL (
			SELECT status, response_time_ms, response_code, created_at
			FROM website_tick
			WHERE website_id = w.id
			AND created_at > now() - interval '10 minutes'
			ORDER BY created_at DESC
			LIMIT 1
		) wt ON true
		WHERE w.user_id = $1
		ORDER BY w.time_added DESC
	`

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var websites []WebsiteWithStatus

	for rows.Next() {
		var w WebsiteWithStatus
		if err := rows.Scan(
			&w.ID,
			&w.URL,
			&w.UserID,
			&w.TimeAdded,
			&w.Status,
			&w.ResponseTime,
			&w.ResponseCode,
			&w.LastCheckedAt,
		); err != nil {
			return nil, err
		}
		websites = append(websites, w)
	}

	return websites, nil
}

func (r *WebsiteRepo) Delete(ctx context.Context, userID, websiteID string) error {
	query := `DELETE FROM website WHERE id = $1 AND user_id = $2`
	_, err := r.db.Exec(ctx, query, websiteID, userID)
	return err
}
