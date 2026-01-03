package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
    "github.com/sthits123/uptime-monitor/internal/database"
	"github.com/sthits123/uptime-monitor/internal/handlers"
	"github.com/sthits123/uptime-monitor/internal/middlewares"
	"github.com/sthits123/uptime-monitor/internal/repositories"
)

type Response struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Code    int    `json:"code"`
}

func createWebsiteHandler(websiteHandler *handlers.WebsiteHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := middlewares.UserID(r)
		if userID == "" {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		websiteHandler.CreateWebsite(w, r, userID)
	}
}
func getWebsiteStatusHandler(websiteHandler *handlers.WebsiteHandler) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        userID := middlewares.UserID(r)
        if userID == "" {
            http.Error(w, "unauthorized", http.StatusUnauthorized)
            return
        }

        websiteID := r.URL.Query().Get("id")
        if websiteID == "" {
            http.Error(w, "website id is required", http.StatusBadRequest)
            return
        }

        websiteHandler.GetWebsiteStatus(w, r, userID, websiteID)
    }
}

func main() {
	// Start the database
	db, err := database.New()
	secret := os.Getenv("JWT_SECRET")
	if err != nil {
		log.Fatal("failed to connect to database: ", err)
	}
	defer db.Close()

	userRepo := repositories.NewUserRepo(db.Pool)
	websiteRepo := repositories.NewWebsiteRepo(db.Pool)
	authHandler := handlers.NewAuthHandler(userRepo, secret)
	websiteHandler := handlers.NewWebsiteHandler(websiteRepo)

	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/v1/healthcheck", handlers.Healthcheck)
	mux.HandleFunc("POST /api/v1/signup", authHandler.Signup)
	mux.HandleFunc("POST /api/v1/signin", authHandler.Signin)
	mux.HandleFunc("POST /api/v1/websites", middlewares.Auth(createWebsiteHandler(websiteHandler)).ServeHTTP)
	mux.HandleFunc("GET /api/v1/websites/{id}", middlewares.Auth(getWebsiteStatusHandler(websiteHandler)).ServeHTTP)

	server := &http.Server{
		Addr:    ":8080",
		Handler:middlewares.CORS(mux),
	}

	go func() {
		log.Println("server listening on :8080")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	// Listen for shutdown signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutdown server")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Println("server forced to shutdown:", err)
	}

	log.Println("server exited properly")

}
