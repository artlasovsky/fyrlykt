package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type server struct{}

func (s *server) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	errorMessage := "done"

	switch req.Method {
	case "POST":
		w.WriteHeader(http.StatusOK)
		var body Input
		json.NewDecoder(req.Body).Decode(&body)
		// fmt.Println(body)
		Fyrlykt(body)
	default:
		w.WriteHeader(http.StatusNotFound)
	}
	response := fmt.Sprintf(`{"message": %s}`, errorMessage)
	w.Write([]byte(response))
}
