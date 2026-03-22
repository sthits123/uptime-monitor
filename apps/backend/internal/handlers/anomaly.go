package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/sthits123/uptime-monitor/internal/models"
	"github.com/sthits123/uptime-monitor/internal/repositories"
)

type AnomalyHandler struct {
	AnomalyRepo *repositories.AnomalyRepo
	RegionRepo  *repositories.RegionRepo
}

func NewAnomalyHandler(
	anomalyRepo *repositories.AnomalyRepo,
	regionRepo *repositories.RegionRepo,
) *AnomalyHandler {
	return &AnomalyHandler{
		AnomalyRepo: anomalyRepo,
		RegionRepo:  regionRepo,
	}
}

func (h *AnomalyHandler) ReceiveAnomalyAlert(w http.ResponseWriter, r *http.Request) {
	var alert models.AnomalyAlert
	if err := json.NewDecoder(r.Body).Decode(&alert); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	regionID, err := h.RegionRepo.EnsureExists(ctx, alert.Region)
	if err != nil {
		log.Printf("Failed to ensure region %s: %v", alert.Region, err)
		http.Error(w, `{"error": "Invalid region"}`, http.StatusBadRequest)
		return
	}

	event := models.AnomalyEvent{
		WebsiteID:      alert.WebsiteID,
		RegionID:       regionID,
		ResponseTimeMs: alert.ResponseTimeMs,
		AnomalyScore:   alert.AnomalyScore,
		Confidence:     alert.Confidence,
		Reason:         alert.Reason,
		IsAnomaly:      alert.IsAnomaly,
	}

	if err := h.AnomalyRepo.Create(ctx, event); err != nil {
		log.Printf("Failed to save anomaly event: %v", err)
		http.Error(w, `{"error": "Failed to save anomaly event"}`, http.StatusInternalServerError)
		return
	}

	log.Printf("Anomaly alert recorded for website %s: %s (score: %.4f, confidence: %.2f)",
		alert.WebsiteID, alert.Reason, alert.AnomalyScore, alert.Confidence)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "recorded",
		"website": alert.WebsiteID,
	})
}

func (h *AnomalyHandler) GetRecentAnomalies(w http.ResponseWriter, r *http.Request) {
	limit := int64(50)
	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed := int64(0); parsed > 0 && parsed <= 100 {
			limit = parsed
		}
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	events, err := h.AnomalyRepo.ListRecentAnomalies(ctx, int(limit))
	if err != nil {
		log.Printf("Failed to get recent anomalies: %v", err)
		http.Error(w, `{"error": "Failed to retrieve anomalies"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"events": events,
		"count":  len(events),
	})
}

func (h *AnomalyHandler) GetAnomaliesByWebsite(w http.ResponseWriter, r *http.Request) {
	websiteID := r.URL.Query().Get("website_id")
	if websiteID == "" {
		http.Error(w, `{"error": "website_id is required"}`, http.StatusBadRequest)
		return
	}

	limit := int64(50)
	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed := int64(0); parsed > 0 && parsed <= 100 {
			limit = parsed
		}
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	events, err := h.AnomalyRepo.ListByWebsiteID(ctx, websiteID, int(limit))
	if err != nil {
		log.Printf("Failed to get anomalies for website %s: %v", websiteID, err)
		http.Error(w, `{"error": "Failed to retrieve anomalies"}`, http.StatusInternalServerError)
		return
	}

	count, _ := h.AnomalyRepo.GetAnomalyCountByWebsite(ctx, websiteID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"website_id":      websiteID,
		"total_anomalies": count,
		"events":          events,
		"count":           len(events),
	})
}

func (h *AnomalyHandler) GetAnomalyScore(w http.ResponseWriter, r *http.Request) {
	websiteID := r.URL.Query().Get("website_id")
	if websiteID == "" {
		http.Error(w, `{"error": "website_id is required"}`, http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	latestAnomaly, err := h.AnomalyRepo.GetLatestAnomalyByWebsite(ctx, websiteID)

	response := map[string]interface{}{
		"website_id":       websiteID,
		"has_anomaly":      false,
		"score":            0.0,
		"confidence":       0.0,
		"reason":           "normal",
		"response_time_ms": 0,
		"region":           "",
	}

	if err == nil && latestAnomaly != nil {
		response["has_anomaly"] = latestAnomaly.IsAnomaly
		response["score"] = latestAnomaly.AnomalyScore
		response["confidence"] = latestAnomaly.Confidence
		response["reason"] = latestAnomaly.Reason
		response["response_time_ms"] = latestAnomaly.ResponseTimeMs
		response["region"] = latestAnomaly.RegionName
		response["detected_at"] = latestAnomaly.CreatedAt
	}

	stats, err := h.AnomalyRepo.GetAnomalyStats(ctx, websiteID)
	if err == nil {
		response["stats"] = stats
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
