package handlers

import (
	"encoding/json"
	"log"
	"net/http"
    "time"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/sthits123/uptime-monitor/internal/models"
	"github.com/sthits123/uptime-monitor/internal/repositories"
	"github.com/sthits123/uptime-monitor/internal/utils"
	"github.com/sthits123/uptime-monitor/internal/validation"
)

type AuthHandler struct {
	userRepo  *repositories.UserRepo
	validator *validator.Validate
	jwtSecret string
}

func NewAuthHandler(userRepo *repositories.UserRepo,jwtsecret string) *AuthHandler {
	return &AuthHandler{
		userRepo:  userRepo,
		validator: validator.New(),
		jwtSecret:jwtsecret,
	}
}

func (h *AuthHandler) Signup(w http.ResponseWriter, r *http.Request) {
	var input validation.SignupInput

	// 🔹 1. JSON → struct (DESERIALIZATION)
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		log.Print(err)
		http.Error(w, "invalid json body", http.StatusBadRequest)
		return
	}

	// 🔹 2. Validate struct
	if err := h.validator.Struct(input); err != nil {
		log.Printf(err.Error())
		http.Error(w, "validation failed", http.StatusBadRequest)
		return
	}

	// 🔹 3. Use the struct fields
	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		log.Print(err)
		http.Error(w, "could not hash password", http.StatusInternalServerError)
		return
	}

	user := models.User{
		ID:       uuid.NewString(),
		Username: input.Username,
		Password: hashedPassword,
	}

	if err := h.userRepo.Create(r.Context(), user); err != nil {
		log.Print(err)
		http.Error(w, "could not create user", http.StatusInternalServerError)
		return
	}

	// 🔹 4. struct → JSON (SERIALIZATION)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"id":       user.ID,
		"username": user.Username,
	})
}

func (h *AuthHandler) Signin(w http.ResponseWriter, r *http.Request) {
	var input validation.SignupInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		log.Print(err)
		http.Error(w, "invalid json body", http.StatusBadRequest)
		return
	}

	if err := h.validator.Struct(input); err != nil {
		log.Print(err)
		http.Error(w, "validation failed", http.StatusBadRequest)
		return
	}

	user, err := h.userRepo.FindByUsername(r.Context(), input.Username)
	if err != nil {
		log.Print(err)
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	if !utils.VerifyPassword(input.Password, user.Password) {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})

	signedToken, err := token.SignedString([]byte(h.jwtSecret))
	if err != nil {
		log.Print(err)
		http.Error(w, "could not create token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"jwt": signedToken,
	})
}