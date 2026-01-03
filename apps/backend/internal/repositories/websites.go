package repositories

import (
	"context"
	"fmt"

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
		return fmt.Errorf("failed to create user: %w", err)
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
