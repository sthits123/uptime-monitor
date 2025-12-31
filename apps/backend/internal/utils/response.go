package utils

import (
	"encoding/json"
	"net/http"
    "github.com/sthits123/uptime-monitor/internal/validation"
)

func WriteError(w http.ResponseWriter, err error) {
	w.Header().Set("Content-Type", "application/json")

	if vErr, ok := err.(validation.ValidationError); ok {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(vErr)
		return
	}

	w.WriteHeader(http.StatusInternalServerError)
}
