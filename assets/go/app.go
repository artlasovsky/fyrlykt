package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/go-vgo/robotgo"
)

func Fyrlykt(input Input) string {
	AppName := input.AppName
	currentAppTitle := robotgo.GetTitle()
	// fmt.Println(currentAppTitle)
	if strings.Contains(currentAppTitle, AppName) {
		AppCommand := input.AppCommand
		Command := AppCommand.Command
		button := "left"
		switch Command {
		case "drag":
			xSet, err := strconv.Atoi(AppCommand.Params[0])
			ySet, err := strconv.Atoi(AppCommand.Params[1])
			xMove, yMove := 0, 0
			xMove, err = strconv.Atoi(AppCommand.ExtraParams[0])
			yMove, err = strconv.Atoi(AppCommand.ExtraParams[1])
			if len(AppCommand.ExtraParams) == 2 {
				button = AppCommand.ExtraParams[2]
			}
			if err == nil {
				// curX, curY := robotgo.GetMousePos()
				robotgo.Move(xSet, ySet)
				robotgo.MouseToggle("down", button)
				robotgo.MoveMouse(xSet+xMove, ySet+yMove)
				robotgo.MouseToggle("up", button)
				// robotgo.Move(curX, curY)
			}
		case "click":
			xSet, err := strconv.Atoi(AppCommand.Params[0])
			ySet, err := strconv.Atoi(AppCommand.Params[1])
			if len(AppCommand.ExtraParams) > 0 {
				button = AppCommand.ExtraParams[0]
			}
			if err == nil {
				robotgo.Move(xSet, ySet)
				robotgo.MouseClick(button)
				robotgo.SetMouseDelay(50)
			}
		case "hotkey":
			mainKey := AppCommand.Params[0]
			modifiers := AppCommand.Params[1:]

			if len(modifiers) > 0 {
				robotgo.KeyTap(mainKey, modifiers)
			} else {
				robotgo.KeyTap(mainKey)
			}
		case "press":
			key := AppCommand.Params[0]
			robotgo.KeyTap(key)
		case "write":
			text := AppCommand.Params[0]
			robotgo.TypeStr(text)
		default:
			return "wrong command"
		}
		return "done"
	} else {
		return fmt.Sprintf("%s is not active", AppName)
	}
}
