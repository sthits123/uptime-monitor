package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/sthits123/uptime-monitor/internal/models"
	"github.com/sthits123/uptime-monitor/internal/repositories"
	"github.com/sthits123/uptime-monitor/internal/utils"
	"github.com/sthits123/uptime-monitor/internal/validation"
)

type WebsiteHandler struct {
	websiteRepo *repositories.WebsiteRepo
	tickRepo    *repositories.WebsiteTickRepo
}

func NewWebsiteHandler(websiteRepo *repositories.WebsiteRepo, tickRepo *repositories.WebsiteTickRepo) *WebsiteHandler {
	return &WebsiteHandler{
		websiteRepo: websiteRepo,
		tickRepo:    tickRepo,
	}
}

func (h *WebsiteHandler) CreateWebsite(w http.ResponseWriter, r *http.Request, userID string) {
	var input validation.WebsiteInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.SendJSONError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := input.Validate(); err != nil {
		utils.SendJSONError(w, err.Error(), http.StatusBadRequest)
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
		utils.SendJSONError(w, "Could not create website", http.StatusInternalServerError)
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
		log.Print(err)
		utils.SendJSONError(w, "Website not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(website)
}

func (h *WebsiteHandler) ListWebsites(w http.ResponseWriter, r *http.Request, userID string) {
	websites, err := h.websiteRepo.ListByUserIDWithStatus(r.Context(), userID)
	if err != nil {
		log.Print(err)
		utils.SendJSONError(w, "Could not fetch websites", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(websites)
}

func (h *WebsiteHandler) DeleteWebsite(w http.ResponseWriter, r *http.Request, userID, websiteID string) {
	if err := h.websiteRepo.Delete(r.Context(), userID, websiteID); err != nil {
		log.Print(err)
		utils.SendJSONError(w, "Could not delete website", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *WebsiteHandler) GetWebsiteTicks(w http.ResponseWriter, r *http.Request, userID, websiteID string) {
	// Verify ownership
	_, err := h.websiteRepo.FindByID(r.Context(), userID, websiteID)
	if err != nil {
		utils.SendJSONError(w, "Website not found", http.StatusNotFound)
		return
	}

	limitStr := r.URL.Query().Get("limit")
	limit, _ := strconv.Atoi(limitStr)
	if limit <= 0 {
		limit = 50
	}

	ticks, err := h.tickRepo.ListByWebsiteID(r.Context(), websiteID, limit)
	if err != nil {
		log.Print(err)
		utils.SendJSONError(w, "Could not fetch history", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ticks)
}

func (h *WebsiteHandler) GetWebsiteRegionalStatus(w http.ResponseWriter, r *http.Request, userID, websiteID string) {

	_, err := h.websiteRepo.FindByID(r.Context(), userID, websiteID)
	if err != nil {
		utils.SendJSONError(w, "Website not found", http.StatusNotFound)
		return
	}

	statuses, err := h.tickRepo.GetLatestTicksByRegion(r.Context(), websiteID)
	if err != nil {
		log.Print(err)
		utils.SendJSONError(w, "Could not fetch regional status", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(statuses)
}

func (h *WebsiteHandler) GetWebsiteRegionalHistory(w http.ResponseWriter, r *http.Request, userID, websiteID string) {
	_, err := h.websiteRepo.FindByID(r.Context(), userID, websiteID)
	if err != nil {
		utils.SendJSONError(w, "Website not found", http.StatusNotFound)
		return
	}

	limitStr := r.URL.Query().Get("limit")
	limit, _ := strconv.Atoi(limitStr)
	if limit <= 0 {
		limit = 100
	}

	ticks, err := h.tickRepo.GetRegionalHistory(r.Context(), websiteID, limit)
	if err != nil {
		log.Print(err)
		utils.SendJSONError(w, "Could not fetch regional history", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ticks)
}
