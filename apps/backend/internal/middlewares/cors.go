package middlewares

import (
	"net/http"
	"os"
	"strings"
)

func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := os.Getenv("CORS_ALLOWED_ORIGINS")
		if origin == "" {
			// In production, this should be set. Fallback to local for development.
			origin = "http://localhost:5173"
		}

		reqOrigin := r.Header.Get("Origin")
		allowedOrigins := strings.Split(origin, ",")

		isAllowed := false
		for _, o := range allowedOrigins {
			if strings.TrimSpace(o) == reqOrigin {
				isAllowed = true
				break
			}
		}

		if isAllowed {
			w.Header().Set("Access-Control-Allow-Origin", reqOrigin)
		} else {
			// Fallback to the first one for development convenience
			w.Header().Set("Access-Control-Allow-Origin", strings.TrimSpace(allowedOrigins[0]))
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
