package repositories

import (
	"context"
	"errors"
	"fmt"
    "github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/sthits123/uptime-monitor/internal/models"
)

var (
	ErrUserNotFound = errors.New("user not found")
)

type UserRepo struct {
	db *pgxpool.Pool
}

func NewUserRepo(db *pgxpool.Pool) *UserRepo {
	return &UserRepo{db: db}
}

func (r *UserRepo) Create(ctx context.Context, u models.User) error {
	query := `
		INSERT INTO users (id, username, password)
		VALUES ($1, $2, $3)
	`

	_, err := r.db.Exec(ctx, query, u.ID, u.Username, u.Password)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}


func (r *UserRepo) FindByID(ctx context.Context, id string) (*models.User, error) {
	query := `
		SELECT id, username, password
		FROM users
		WHERE id = $1
	`

	var user models.User
	err := r.db.QueryRow(ctx, query, id).Scan(&user.ID, &user.Username, &user.Password)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to find user by id: %w", err)
	}

	return &user, nil
}

func (r *UserRepo) FindByUsername(ctx context.Context, username string) (*models.User, error) {
	query := `
		SELECT id, username, password
		FROM users
		WHERE username = $1
	`

	var user models.User
	err := r.db.QueryRow(ctx, query, username).
		Scan(&user.ID, &user.Username, &user.Password)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to find user by username: %w", err)
	}

	return &user, nil
}
