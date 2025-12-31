package validation

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
)

type FieldError struct {
	Field string `json:"field"`
	Error string `json:"error"`
}

type ValidationError struct {
	Message string       `json:"message"`
	Errors  []FieldError `json:"errors,omitempty"`
}

func (e ValidationError) Error() string {
	return e.Message
}

func NewBadRequest(msg string, fields []FieldError) error {
	return ValidationError{
		Message: msg,
		Errors:  fields,
	}
}

func ExtractValidationErrors(err error) error {
	var fields []FieldError

	if verrs, ok := err.(validator.ValidationErrors); ok {
		for _, e := range verrs {
			fields = append(fields, FieldError{
				Field: strings.ToLower(e.Field()),
				Error: messageFor(e),
			})
		}

		return ValidationError{
			Message: "validation failed",
			Errors:  fields,
		}
	}

	return err
}

func messageFor(e validator.FieldError) string {
	switch e.Tag() {
	case "required":
		return "is required"
	case "min":
		if e.Type().Kind() == reflect.String {
			return fmt.Sprintf("must be at least %s characters", e.Param())
		}
		return fmt.Sprintf("must be at least %s", e.Param())
	default:
		return "is invalid"
	}
}
