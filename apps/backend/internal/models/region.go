package models

import "github.com/google/uuid"

type Region struct {
	ID   uuid.UUID `db:"id" json:"id"`
	Name string    `db:"name" json:"name"`
}
