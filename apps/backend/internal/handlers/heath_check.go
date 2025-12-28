package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/sthits123/uptime-monitor/internal/errs"
)

func Healthcheck(w http.ResponseWriter, r *http.Request) {

	data := errs.HTTPError{
		Status:  "success",
		Message: "healthy",
		Code:    http.StatusOK,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
