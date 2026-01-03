package middlewares

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"
    "github.com/golang-jwt/jwt/v5"
)

type ctxKey string

const userIDKey ctxKey = "userId"

func getSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return []byte("supersecret")
	}
	return []byte(secret)
}

func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Step 1: Extract Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "unauthorized: missing authorization header", http.StatusUnauthorized)
			return
		}

		// Step 2: Split header into scheme and token (e.g., "Bearer <token>")
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "unauthorized: invalid authorization format", http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]

		
		secret := getSecret()
		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return secret, nil
		})

		if err != nil {
			http.Error(w, "unauthorized: invalid token", http.StatusUnauthorized)
			return
		}

		if !token.Valid {
			http.Error(w, "unauthorized: token is not valid", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "unauthorized: invalid token claims", http.StatusUnauthorized)
			return
		}

		userID, ok := claims["sub"].(string)
		if !ok || userID == "" {
			http.Error(w, "unauthorized: missing or invalid user id", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), userIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func UserID(r *http.Request) string {
	userID, ok := r.Context().Value(userIDKey).(string)
	if !ok {
		return ""
	}
	return userID
}
