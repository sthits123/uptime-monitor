package validation

type SignupInput struct {
	Username string `json:"username" validate:"required,min=3"`
	Password string `json:"password" validate:"required,min=8"`
}

type SigninInput struct {
	Username string `json:"username" validate:"required,min=3"`
	Password string `json:"password" validate:"required,min=8"`
}

func (payload SignupInput) Validate() error {
	return Validate.Struct(payload)
}

func (payload SigninInput) Validate() error {
	return Validate.Struct(payload)
}
