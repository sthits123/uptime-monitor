package models

import (
	"time"
)

type AnomalyEvent struct {
	ID             string    `db:"id" json:"id"`
	WebsiteID      string    `db:"website_id" json:"website_id"`
	RegionID       string    `db:"region_id" json:"region_id"`
	ResponseTimeMs int       `db:"response_time_ms" json:"response_time_ms"`
	AnomalyScore   float64   `db:"anomaly_score" json:"anomaly_score"`
	Confidence     float64   `db:"confidence" json:"confidence"`
	Reason         string    `db:"reason" json:"reason"`
	IsAnomaly      bool      `db:"is_anomaly" json:"is_anomaly"`
	CreatedAt      time.Time `db:"created_at" json:"created_at"`
}

type AnomalyAlert struct {
	WebsiteID      string  `json:"website_id" binding:"required"`
	Region         string  `json:"region" binding:"required"`
	ResponseTimeMs int     `json:"response_time_ms"`
	AnomalyScore   float64 `json:"anomaly_score"`
	Confidence     float64 `json:"confidence"`
	Reason         string  `json:"reason"`
	IsAnomaly      bool    `json:"is_anomaly"`
}

type AnomalyEventWithDetails struct {
	AnomalyEvent
	WebsiteURL string `db:"website_url" json:"website_url"`
	RegionName string `db:"region_name" json:"region_name"`
}
