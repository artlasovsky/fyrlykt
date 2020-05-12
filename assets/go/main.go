package main

import (
	"fmt"
	"net/http"
)

type appCommand struct {
	Command     string
	Params      []string
	ExtraParams []string
}

type Input struct {
	AppName    string
	AppCommand appCommand
}

func main() {
	// SERVER
	fmt.Println("[go] Fyrlykt - Started")
	s := &server{}
	http.Handle("/", s)
	http.ListenAndServe(":4004", nil)

	// INPUT
	// scanner := bufio.NewScanner(os.Stdin)
	// for scanner.Scan() {
	// 	inputJSON := []byte(scanner.Text())

	// 	var input Input

	// 	err := json.Unmarshal(inputJSON, &input)
	// 	if err == nil {
	// 		response := Fyrlykt(input)
	// 		fmt.Println(response)
	// 	} else {
	// 		fmt.Println("JSON parse Error")
	// 		fmt.Println(err)
	// 	}
	// }
}
