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

type Database struct{
	Pool *pgxpool.Pool
}


const DatabasePingTimeout = 10

func New() (*Database, error) {
	
	err:=godotenv.Load()
	if err!=nil{
		log.Fatal("Error loading .env files")
	}

	pool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		return nil, fmt.Errorf("failed to create pgx pool: %w", err)
	}

	database := &Database{
		Pool: pool,
	}

	ctx, cancel := context.WithTimeout(context.Background(), DatabasePingTimeout*time.Second)
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