package validation

type SignupInput struct {
	Username string `json:"username" validate:"required,min=3"`
	Password string `json:"password" validate:"required,min=6"`
}

type SigninInput struct {
	Username string `json:"username" validate:"required,min=3"`
	Password string `json:"password" validate:"required,min=6"`
}



func (payload SignupInput) Validate() error{
	return Validate.Struct(payload)
}

func(payload SigninInput) Validate() error{
	return Validate.Struct(payload)
}




