package models

import (
	"time"

)

type Website struct {
	ID        string `db:"id" json:"id"`
	URL       string    `db:"url" json:"url"`
	UserID    string `db:"user_id" json:"user_id"`
	TimeAdded time.Time `db:"time_added" json:"time_added"`
}
