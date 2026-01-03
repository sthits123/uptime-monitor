package workers

import (
	"net/http"
	"time"
)

type CheckResult struct {
	WebsiteID     string
	ResponseTime  int
	Status        string
	ResponseCode *int
	ErrorMessage *string
}

func CheckWebsite(url string, websiteID string) CheckResult {
	start := time.Now()

	resp, err := http.Get(url)
	elapsed := time.Since(start).Milliseconds()

	if err != nil {
		msg := err.Error()
		return CheckResult{
			WebsiteID:    websiteID,
			ResponseTime: int(elapsed),
			Status:       "down",
			ErrorMessage: &msg,
		}
	}

	defer resp.Body.Close()

	code := resp.StatusCode
	status := "up"
	if code >= 500 {
		status = "down"
	}

	return CheckResult{
		WebsiteID:     websiteID,
		ResponseTime:  int(elapsed),
		Status:        status,
		ResponseCode:  &code,
	}
}
