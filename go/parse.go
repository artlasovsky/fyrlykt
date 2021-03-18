package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/go-vgo/robotgo"
)

func parseKey(keyId int, keyValue int, keys []Key, appConfig AppConfig, fnKey bool) {
	found, value := searchKey(keyId, keys)
	if found {
		switch keyValue {
		case 1:
			if fnKey {
				parseShortcut(value.Fn[2], appConfig)
			} else {
				parseShortcut(value.Value[2], appConfig)
			}
			break
		case 127:
			if fnKey {
				parseShortcut(value.Fn[1], appConfig)
			} else {
				parseShortcut(value.Value[1], appConfig)
			}
			break
		case 64:
			if fnKey {
				parseShortcut(value.Fn[0], appConfig)
			} else {
				parseShortcut(value.Value[0], appConfig)
			}
			break
		default:
			break
		}
	} else {
		fmt.Println("Value - Not Found")
	}
}

func parseShortcut(shortcut string, appConfig AppConfig) {
	fmt.Println(shortcut)
	if strings.Contains(shortcut, " > ") {
		split := strings.Split(shortcut, " > ")
		category := split[0]
		name := split[1]
		found, value := searchShortcut(category, name, appConfig.Shortcuts)
		if found {
			runShortcut(value)
		} else {
			fmt.Println("Shortcut - Not Found")
		}
	} else {
		fmt.Println(("Empty Shortcut"))
	}
}

func runShortcut(shortcut string) {
	commands := strings.Split(shortcut, "~")
	for _, command := range commands {
		commandType := ""
		if strings.Contains(command, "{bitmap") && strings.Contains(command, "}") {
			commandType = "bitmap"
			command = strings.ReplaceAll(command, "{bitmap_", "")
			command = strings.ReplaceAll(command, "}", "")
		}
		if strings.Contains(command, "{drag") && strings.Contains(command, "}") {
			commandType = "drag"
			command = strings.ReplaceAll(command, "{drag_", "")
			command = strings.ReplaceAll(command, "}", "")
		}
		if strings.Contains(command, "{doubleclick") && strings.Contains(command, "}") {
			commandType = "doubleclick"
			command = strings.ReplaceAll(command, "{doubleclick_", "")
			command = strings.ReplaceAll(command, "}", "")
		}
		if strings.Contains(command, "{") && strings.Contains(command, "}") {
			commandType = "shortcut"
			command = strings.ReplaceAll(command, "{", "")
			command = strings.ReplaceAll(command, "}", "")
		}
		if strings.Contains(command, "write[") && strings.Contains(command, "]") {
			commandType = "write"
			command = strings.ReplaceAll(command, "write[", "")
			command = strings.ReplaceAll(command, "]", "")
		}
		if strings.Contains(command, "[") && strings.Contains(command, "]") {
			commandType = "key"
			command = strings.ReplaceAll(command, "[", "")
			command = strings.ReplaceAll(command, "]", "")
		}
		result := parseCommand(command, commandType)
		if !result {
			break
		}
	}
}

func parseCommand(command string, commandType string) bool {
	assetsPath := "./ui"
	switch commandType {
	case "bitmap":
		value := strings.Split(command, ":")
		filename := value[0]
		xShift, _ := strconv.Atoi(value[1])
		yShift, _ := strconv.Atoi(value[2])
		filepath := assetsPath + "/" + filename + ".png"
		bitmap := robotgo.OpenBitmap(filepath)
		xPos, yPos := robotgo.FindBitmap(bitmap)
		if xPos != -1 {
			robotgo.Move(xPos+xShift, yPos+yShift)
		} else {
			return false
		}
		break
	case "drag":
		value := strings.Split(command, ":")
		button := "left"
		xSet, _ := strconv.Atoi(value[0])
		ySet, _ := strconv.Atoi(value[1])
		xMove, yMove := 0, 0
		xMove, _ = strconv.Atoi(value[2])
		yMove, _ = strconv.Atoi(value[3])
		if len(value) == 2 {
			button = value[2]
		}
		if xSet == -1 || ySet == -1 {
			xSet, ySet = robotgo.GetMousePos()
		} else {
			robotgo.Move(xSet, ySet)
		}
		// fmt.Println(button)
		// robotgo.Move(xPos+xShift, yPos+yShift)
		// robotgo.MouseToggle("down")
		// robotgo.MoveMouseSmooth(xPos+xShift-50, yPos+yShift+0)
		// robotgo.MouseToggle("up")
		robotgo.MouseToggle("down", button)
		// robotgo.MoveMouseSmooth(xSet+xMove, ySet+yMove)
		robotgo.MoveMouseSmooth(xSet+xMove, ySet+yMove, 0.1)
		robotgo.MouseToggle("up", button)
		break
	case "doubleclick":
		robotgo.MouseClick()
		robotgo.MouseClick()
	case "shortcut":
		keys := strings.Split(command, "++")
		mainKey := keys[0]
		modifiers := keys[1:]

		if len(modifiers) > 0 {
			robotgo.KeyTap(mainKey, modifiers)
		} else {
			robotgo.KeyTap(mainKey)
		}
		// fmt.Println(command)
		break
	case "write":
		robotgo.TypeStr(command)
		break
	case "key":
		robotgo.KeyTap(command)
		break
	default:
		fmt.Println("Parse Command - Error")
		break
	}
	return true
}
