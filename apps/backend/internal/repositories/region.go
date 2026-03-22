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

// EnsureExists ensures a region exists and returns its ID
func (r *RegionRepo) EnsureExists(ctx context.Context, name string) (string, error) {
	var id string

	// Try to get existing
	err := r.db.QueryRow(ctx, `
		SELECT id::text FROM region WHERE name = $1
	`, name).Scan(&id)

	if err == nil {
		return id, nil
	}

	// Create if not exists
	err = r.db.QueryRow(ctx, `
		INSERT INTO region (id, name)
		VALUES (gen_random_uuid(), $1)
		ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
		RETURNING id::text
	`, name).Scan(&id)

	if err != nil {
		// If ON CONFLICT isn't supported or fails, try a simple insert
		err = r.db.QueryRow(ctx, `
			INSERT INTO region (id, name)
			VALUES (gen_random_uuid(), $1)
			RETURNING id::text
		`, name).Scan(&id)
		if err != nil {
			return "", fmt.Errorf("failed to ensure region exists: %w", err)
		}
	}

	return id, nil
}
