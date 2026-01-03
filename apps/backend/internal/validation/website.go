package validation


type WebsiteInput struct {
	URL string `json:"url" validate:"required,url"`
}

func(w WebsiteInput) Validate() error{
  return Validate.Struct(w)
}