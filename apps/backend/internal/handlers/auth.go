package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"

	"github.com/sthits123/uptime-monitor/internal/models"
	"github.com/sthits123/uptime-monitor/internal/repositories"
	"github.com/sthits123/uptime-monitor/internal/utils"
	"github.com/sthits123/uptime-monitor/internal/validation"
)

type AuthHandler struct {
	userRepo  *repositories.UserRepo
	jwtSecret string
}

func NewAuthHandler(userRepo *repositories.UserRepo, jwtSecret string) *AuthHandler {
	return &AuthHandler{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
	}
}

func (h *AuthHandler) Signup(w http.ResponseWriter, r *http.Request) {
	var input validation.SignupInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid json body", http.StatusBadRequest)
		return
	}

	if err := input.Validate(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		log.Println(err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	user := models.User{
		ID:       uuid.NewString(),
		Username: input.Username,
		Password: hashedPassword,
	}

	if err := h.userRepo.Create(r.Context(), user); err != nil {
		log.Println(err)
		http.Error(w, "could not create user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"id":       user.ID,
		"username": user.Username,
	})
}

func (h *AuthHandler) Signin(w http.ResponseWriter, r *http.Request) {
	var input validation.SigninInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid json body", http.StatusBadRequest)
		return
	}

	if err := input.Validate(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := h.userRepo.FindByUsername(r.Context(), input.Username)
	if err != nil || !utils.VerifyPassword(input.Password, user.Password) {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	claims := jwt.RegisteredClaims{
		Subject:   user.ID,
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString([]byte(h.jwtSecret))
	if err != nil {
		log.Println(err)
		http.Error(w, "could not create token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"jwt": signedToken,
	})
}
