package main

import "fmt"

func sendCommand(command int) {
	fmt.Print("Command: ")
	switch command {
	case 78:
		fmt.Println("Left")
		break
	default:
		fmt.Println("---")
		break
	}
}
