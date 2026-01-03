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
