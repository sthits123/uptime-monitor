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

func (h *AuthHandler) generateToken(userID string) (string, error) {
	claims := jwt.RegisteredClaims{
		Subject:   userID,
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := h.jwtSecret
	if secret == "" {
		secret = "supersecret"
	}
	return token.SignedString([]byte(secret))
}

func (h *AuthHandler) Signup(w http.ResponseWriter, r *http.Request) {
	var input validation.SignupInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.SendJSONError(w, "Invalid request body. Please check your username and password.", http.StatusBadRequest)
		return
	}

	if err := input.Validate(); err != nil {
		utils.SendJSONError(w, err.Error(), http.StatusBadRequest)
		return
	}

	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		log.Println("password hashing failed:", err)
		utils.SendJSONError(w, "Internal server error. Please try again later.", http.StatusInternalServerError)
		return
	}

	user := models.User{
		ID:       uuid.NewString(),
		Username: input.Username,
		Password: hashedPassword,
	}

	if err := h.userRepo.Create(r.Context(), user); err != nil {
		log.Println("user creation failed:", err)
		utils.SendJSONError(w, "That username is already taken. Please try another one.", http.StatusConflict)
		return
	}

	token, err := h.generateToken(user.ID)
	if err != nil {
		log.Println("token generation failed:", err)
		// We still created the user, but couldn't log them in.
		// For robustness, let's just return the user info without token.
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"id":       user.ID,
			"username": user.Username,
			"message":  "Account created, but please sign in manually.",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token":    token,
		"username": user.Username,
		"message":  "Account created successfully",
	})
}

func (h *AuthHandler) Signin(w http.ResponseWriter, r *http.Request) {
	var input validation.SigninInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.SendJSONError(w, "Invalid request body. Please check your username and password.", http.StatusBadRequest)
		return
	}

	if err := input.Validate(); err != nil {
		utils.SendJSONError(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := h.userRepo.FindByUsername(r.Context(), input.Username)
	if err != nil || !utils.VerifyPassword(input.Password, user.Password) {
		utils.SendJSONError(w, "Wrong username or password. Please try again.", http.StatusUnauthorized)
		return
	}

	token, err := h.generateToken(user.ID)
	if err != nil {
		log.Println("token generation failed:", err)
		utils.SendJSONError(w, "Internal server error. Could not create session.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token":    token,
		"username": user.Username,
		"message":  "Signed in successfully",
	})
}
