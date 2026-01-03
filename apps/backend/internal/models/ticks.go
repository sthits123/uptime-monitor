package models

import (
	"time"
    "github.com/google/uuid"
)

type WebsiteStatus string

const (
	StatusUp      WebsiteStatus = "Up"
	StatusDown    WebsiteStatus = "Down"
	StatusUnknown WebsiteStatus = "Unknown"
)


type WebsiteTick struct {
	ID             uuid.UUID     `db:"id" json:"id"`
	ResponseTimeMs int           `db:"response_time_ms" json:"response_time_ms"`
	Status         WebsiteStatus `db:"status" json:"status"`
	RegionID       uuid.UUID     `db:"region_id" json:"region_id"`
	WebsiteID      uuid.UUID     `db:"website_id" json:"website_id"`
	CreatedAt      time.Time     `db:"created_at" json:"created_at"`
}

type WebsiteWithStatus struct {
	Website
	Status         WebsiteStatus `db:"status" json:"status"`
	ResponseTimeMs int           `db:"response_time_ms" json:"response_time_ms"`
	CheckedAt      time.Time     `db:"created_at" json:"checked_at"`
}
