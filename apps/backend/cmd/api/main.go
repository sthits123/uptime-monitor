package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type Response struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Code    int    `json:"code"`
}

func Healthcheck(w http.ResponseWriter,r *http.Request){
   data:=Response{
	Status:"success",
	Message:"healthy",
	Code : http.StatusOK,
   }	

   w.Header().Set("Content-Type","application/json")
   w.WriteHeader(http.StatusOK)

   err:=json.NewEncoder(w).Encode(data)
   if err!=nil {
     http.Error(w,err.Error(),http.StatusInternalServerError)
      return 
	}
}

func main(){
	mux:=http.NewServeMux()
    
	mux.HandleFunc("GET /api/v1/healthcheck",Healthcheck)
   
	log.Println("The server is listening at port:8080")
 
	if err:=http.ListenAndServe(":8080",mux);err!=nil{
	   log.Fatal(err.Error())
   }
}
