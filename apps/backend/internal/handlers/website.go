package handlers

import (
	
	"encoding/json"
	"log"
	"net/http"
	"time"
    "github.com/google/uuid"
	"github.com/sthits123/uptime-monitor/internal/models"
	"github.com/sthits123/uptime-monitor/internal/repositories"
	"github.com/sthits123/uptime-monitor/internal/validation"
)

type WebsiteHandler struct {
	websiteRepo *repositories.WebsiteRepo
}

func NewWebsiteHandler(websiteRepo *repositories.WebsiteRepo) *WebsiteHandler {
	return &WebsiteHandler{websiteRepo: websiteRepo}
}

func (h *WebsiteHandler) CreateWebsite(w http.ResponseWriter, r *http.Request, userID string) {
	var input validation.WebsiteInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid json body", http.StatusBadRequest)
		return
	}
	

	website := models.Website{
		ID:        uuid.NewString(),
		URL:       input.URL,
		UserID:    userID,
		TimeAdded: time.Now(),
	}

	if err := h.websiteRepo.Create(r.Context(), website); err != nil {
		log.Print(err)
		http.Error(w, "could not create website", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"id":  website.ID,
		"url": website.URL,
	})
}

func (h *WebsiteHandler) GetWebsiteStatus(w http.ResponseWriter, r *http.Request, userID, websiteID string) {
	website, err := h.websiteRepo.FindByID(r.Context(), userID, websiteID)
	if err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":      website.ID,
		"url":     website.URL,
		"user_id": website.UserID,
		"latest_tick": website.LatestTick, 
	})
}
