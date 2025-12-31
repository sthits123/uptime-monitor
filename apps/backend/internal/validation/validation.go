package validation

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
)

var Validate = validator.New()

type Validatable interface {
	Validate() error
}

func DecodeAndValidate(r *http.Request, dst Validatable) error {
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	if err := dec.Decode(dst); err != nil {
		return NewBadRequest("invalid request body", nil)
	}

	if err := dst.Validate(); err != nil {
		return ExtractValidationErrors(err)
	}

	return nil
}
