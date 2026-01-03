package repositories

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type RegionRepo struct {
	db *pgxpool.Pool
}

func NewRegionRepo(db *pgxpool.Pool) *RegionRepo {
	return &RegionRepo{db: db}
}

// GetByName gets a region by name
func (r *RegionRepo) GetByName(ctx context.Context, name string) (string, error) {
	var id string

	err := r.db.QueryRow(ctx, `
		SELECT id::text
		FROM region
		WHERE name = $1
		LIMIT 1
	`, name).Scan(&id)

	if err != nil {
		return "", fmt.Errorf("region not found: %w", err)
	}

	return id, nil
}
