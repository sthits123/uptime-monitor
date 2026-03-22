package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

type Database struct {
	Pool *pgxpool.Pool
}

const DatabasePingTimeout = 60

func New() (*Database, error) {

	_ = godotenv.Overload()

	config, err := pgxpool.ParseConfig(os.Getenv("DATABASE_URL"))
	if err != nil {
		return nil, fmt.Errorf("failed to parse database url: %w", err)
	}

	// Limit max connections to avoid hitting Neon's free tier limits
	config.MaxConns = 10

	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("failed to create pgx pool: %w", err)
	}

	database := &Database{
		Pool: pool,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()
	if err = pool.Ping(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("connected to the database")

	return database, nil
}

func (db *Database) Close() error {
	log.Printf("Closing connection pool")
	db.Pool.Close()
	return nil
}
