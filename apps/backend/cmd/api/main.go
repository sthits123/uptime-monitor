package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"context"
	"time"
    "github.com/sthits123/uptime-monitor/internal/database"
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
	 //Start the databse
	 db, err := database.New()
	 
	 if err != nil {
		 log.Fatal("failed to connect to database: ", err)
	 }
	 defer db.Close()
	
	mux:=http.NewServeMux()
    
	mux.HandleFunc("GET /api/v1/healthcheck",Healthcheck)
    

     server:=&http.Server{
		Addr:":8080",
        Handler:mux,		
	 }

	
	
	 go func() {
		log.Println("server listening on :8080")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	//Listen for shutdown signal
	quit:=make(chan os.Signal,1)
	signal.Notify(quit,os.Interrupt,syscall.SIGTERM)
    <- quit
	
	log.Println("Shutdown server")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Println("server forced to shutdown:", err)
	}

	log.Println("server exited properly")
	
   
}