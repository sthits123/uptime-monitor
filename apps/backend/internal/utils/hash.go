package utils

import (
	"log"

	"github.com/alexedwards/argon2id"
)

func HashPassword(password string) (string, error) {
	hash, err := argon2id.CreateHash(password, argon2id.DefaultParams)
	if err != nil {
		return "", err
	}
	return hash, nil
}

func VerifyPassword(password string, hash string) (match bool) {

	match, err := argon2id.ComparePasswordAndHash(password, hash)
	if err != nil {
		log.Print(err)
	}

	return match
}
