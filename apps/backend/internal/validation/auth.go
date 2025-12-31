package validation

type SignupInput struct {
	Username string `json:"username" validate:"required,min=3"`
	Password string `json:"password" validate:"required,min=6"`
}

type SigninInput struct {
	Username string `json:"username" validate:"required,min=3"`
	Password string `json:"password" validate:"required,min=6"`
}
type WebsiteInput struct {
	URL string `json:"url" validate:"required,url"`
}

func (w WebsiteInput) Validate() error {
	return Validate.Struct(w)
}


func (payload SignupInput) Validate() error{
	return Validate.Struct(payload)
}

func(payload SigninInput) Validate() error{
	return Validate.Struct(payload)
}




