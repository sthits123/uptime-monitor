package database

import (
	"context"
	"embed"
	"fmt"
	"io/fs"

	"log"
	"os"

	"github.com/jackc/pgx/v5"
	tern "github.com/jackc/tern/v2/migrate"
	"github.com/joho/godotenv"
)

var migrations embed.FS

func Migrate(ctx context.Context) error {

	godotenv.Load()
	dsn := os.Getenv("DATABASE_URL")

	conn, err := pgx.Connect(ctx, dsn)
	if err != nil {
		return err
	}
	defer conn.Close(ctx)

	m, err := tern.NewMigrator(ctx, conn, "schema_version")
	if err != nil {
		return fmt.Errorf("constructing database migrator: %w", err)
	}
	subtree, err := fs.Sub(migrations, "migrations")
	if err != nil {
		return fmt.Errorf("retrieving database migrations subtree: %w", err)
	}
	if err := m.LoadMigrations(subtree); err != nil {
		return fmt.Errorf("loading database migrations: %w", err)
	}
	from, err := m.GetCurrentVersion(ctx)
	if err != nil {
		return fmt.Errorf("retreiving current database migration version")
	}
	if err := m.Migrate(ctx); err != nil {
		return err
	}
	if from == int32(len(m.Migrations)) {
		log.Printf("database schema up to date, version %d", len(m.Migrations))
	} else {
		log.Printf("migrated database schema, from %d to %d", from, len(m.Migrations))
	}
	return nil
}
