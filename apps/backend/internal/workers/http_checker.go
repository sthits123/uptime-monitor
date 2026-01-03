package workers

import (
	"net/http"
	"time"

)

func CheckWebsite(url string) (status string,latency int64){
    start:=time.Now()

	client:=http.Client{
		Timeout:5*time.Second,
	}

	resp,err:=client.Get(url)
	latency = time.Since(start).Milliseconds()
    
	if err!=nil{
		return "Down",latency
	}
    
	if resp.StatusCode>=200 && resp.StatusCode < 400{
       return "Up",latency
	}

	return "Down",latency


}