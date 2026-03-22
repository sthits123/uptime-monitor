package repositories

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/sthits123/uptime-monitor/internal/models"
)

type AnomalyRepo struct {
	db *pgxpool.Pool
}

func NewAnomalyRepo(db *pgxpool.Pool) *AnomalyRepo {
	return &AnomalyRepo{db: db}
}

func (r *AnomalyRepo) Create(ctx context.Context, event models.AnomalyEvent) error {
	query := `
		INSERT INTO anomaly_event (
			id, website_id, region_id, response_time_ms,
			anomaly_score, confidence, reason, is_anomaly, created_at
		)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)
	`
	_, err := r.db.Exec(
		ctx,
		query,
		event.WebsiteID,
		event.RegionID,
		event.ResponseTimeMs,
		event.AnomalyScore,
		event.Confidence,
		event.Reason,
		event.IsAnomaly,
		time.Now(),
	)
	if err != nil {
		return fmt.Errorf("failed to create anomaly event: %w", err)
	}
	return nil
}

func (r *AnomalyRepo) ListByWebsiteID(ctx context.Context, websiteID string, limit int) ([]models.AnomalyEvent, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, website_id, region_id, response_time_ms,
		       anomaly_score, confidence, reason, is_anomaly, created_at
		FROM anomaly_event
		WHERE website_id = $1
		ORDER BY created_at DESC
		LIMIT $2
	`, websiteID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []models.AnomalyEvent
	for rows.Next() {
		var e models.AnomalyEvent
		if err := rows.Scan(
			&e.ID, &e.WebsiteID, &e.RegionID, &e.ResponseTimeMs,
			&e.AnomalyScore, &e.Confidence, &e.Reason, &e.IsAnomaly, &e.CreatedAt,
		); err != nil {
			return nil, err
		}
		events = append(events, e)
	}
	return events, nil
}

func (r *AnomalyRepo) ListRecentAnomalies(ctx context.Context, limit int) ([]models.AnomalyEventWithDetails, error) {
	rows, err := r.db.Query(ctx, `
		SELECT 
			ae.id, ae.website_id, ae.region_id, ae.response_time_ms,
			ae.anomaly_score, ae.confidence, ae.reason, ae.is_anomaly, ae.created_at,
			w.url as website_url,
			reg.name as region_name
		FROM anomaly_event ae
		JOIN website w ON ae.website_id = w.id
		JOIN region reg ON ae.region_id = reg.id
		WHERE ae.is_anomaly = true
		ORDER BY ae.created_at DESC
		LIMIT $1
	`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []models.AnomalyEventWithDetails
	for rows.Next() {
		var e models.AnomalyEventWithDetails
		if err := rows.Scan(
			&e.ID, &e.WebsiteID, &e.RegionID, &e.ResponseTimeMs,
			&e.AnomalyScore, &e.Confidence, &e.Reason, &e.IsAnomaly, &e.CreatedAt,
			&e.WebsiteURL, &e.RegionName,
		); err != nil {
			return nil, err
		}
		events = append(events, e)
	}
	return events, nil
}

func (r *AnomalyRepo) GetAnomalyCountByWebsite(ctx context.Context, websiteID string) (int, error) {
	var count int
	err := r.db.QueryRow(ctx, `
		SELECT COUNT(*) FROM anomaly_event
		WHERE website_id = $1 AND is_anomaly = true
	`, websiteID).Scan(&count)
	return count, err
}

func (r *AnomalyRepo) GetLatestAnomalyByWebsite(ctx context.Context, websiteID string) (*models.AnomalyEventWithDetails, error) {
	query := `
		SELECT 
			ae.id, ae.website_id, ae.region_id, ae.response_time_ms,
			ae.anomaly_score, ae.confidence, ae.reason, ae.is_anomaly, ae.created_at,
			w.url as website_url,
			reg.name as region_name
		FROM anomaly_event ae
		JOIN website w ON ae.website_id = w.id
		JOIN region reg ON ae.region_id = reg.id
		WHERE ae.website_id = $1
		ORDER BY ae.created_at DESC
		LIMIT 1
	`

	row := r.db.QueryRow(ctx, query, websiteID)
	var e models.AnomalyEventWithDetails
	err := row.Scan(
		&e.ID, &e.WebsiteID, &e.RegionID, &e.ResponseTimeMs,
		&e.AnomalyScore, &e.Confidence, &e.Reason, &e.IsAnomaly, &e.CreatedAt,
		&e.WebsiteURL, &e.RegionName,
	)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *AnomalyRepo) GetAnomalyStats(ctx context.Context, websiteID string) (map[string]interface{}, error) {
	stats := make(map[string]interface{})

	var totalCount int
	err := r.db.QueryRow(ctx, `
		SELECT COUNT(*) FROM anomaly_event WHERE website_id = $1
	`, websiteID).Scan(&totalCount)
	if err != nil {
		return nil, err
	}
	stats["total_events"] = totalCount

	var anomalyCount int
	err = r.db.QueryRow(ctx, `
		SELECT COUNT(*) FROM anomaly_event WHERE website_id = $1 AND is_anomaly = true
	`, websiteID).Scan(&anomalyCount)
	if err != nil {
		return nil, err
	}
	stats["anomaly_count"] = anomalyCount

	var avgScore *float64
	err = r.db.QueryRow(ctx, `
		SELECT AVG(anomaly_score) FROM anomaly_event WHERE website_id = $1
	`, websiteID).Scan(&avgScore)
	if err == nil && avgScore != nil {
		stats["avg_score"] = *avgScore
	} else {
		stats["avg_score"] = 0.0
	}

	var lastAnomaly *time.Time
	err = r.db.QueryRow(ctx, `
		SELECT created_at FROM anomaly_event 
		WHERE website_id = $1 AND is_anomaly = true
		ORDER BY created_at DESC LIMIT 1
	`, websiteID).Scan(&lastAnomaly)
	if err == nil && lastAnomaly != nil {
		stats["last_anomaly_at"] = lastAnomaly
	}

	return stats, nil
}
