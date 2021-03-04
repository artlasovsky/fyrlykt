package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/go-vgo/robotgo"
	"gitlab.com/gomidi/midi"
	"gitlab.com/gomidi/midi/reader"
	driver "gitlab.com/gomidi/rtmididrv"
)

func must(err error) {
	if err != nil {
		panic(err.Error())
	}
}

// This example expects the first input and output port to be connected
// somehow (are either virtual MIDI through ports or physically connected).
// We write to the out port and listen to the in port.

func makeTimestamp() int64 {
	return time.Now().UnixNano() / (int64(time.Millisecond) / int64(time.Nanosecond))
}

func main() {
	fmt.Println(os.Args)

	drv, err := driver.New()
	must(err)
	defer drv.Close()
	ins, err := drv.Ins()
	must(err)

	devices := []string{"Loupedeck+", "Loupedeck"}
	device := findPort(ins, devices)
	loupedeckConfig := "loupedeck.config.json"
	resolveConfig := "resolve.config.json"
	if len(os.Args) == 3 {
		loupedeckConfig = os.Args[1]
		resolveConfig = os.Args[2]
	}

	err, resolveJSON := readJSON(resolveConfig)
	must(err)
	appConfig := parseAppConfig(resolveJSON)

	err, configJSON := readJSON(loupedeckConfig)
	// must(err)
	file := parseConfigJSON(configJSON)
	fmt.Println(file.Panel)

	if device >= 0 {
		in := ins[device]
		if in.Open() == nil {

			fmt.Println("Run Reader")

			timestamp := makeTimestamp()
			prevKey := -1
			prevKeyValue := -1
			timepass := 0
			fnPressed := false
			rd := reader.New(
				reader.Each(func(_ *reader.Position, msg midi.Message) {
					currentApp := robotgo.GetTitle()
					fmt.Println(currentApp)
					fmt.Println(appConfig.App)
					if strings.Contains(currentApp, appConfig.App) {
						fmt.Println("Resolve is Active")
					} else {
						fmt.Println("Resolve is not active")
					}
					keyId := int(msg.Raw()[1])
					keyValue := int(msg.Raw()[2])

					// FN
					if keyId == 110 && keyValue == 64 {
						fnPressed = true
					} else if keyId == 110 && keyValue == 0 {
						fnPressed = false
					}
					fmt.Println(fnPressed)

					// Reduce multiple shortcuts in a short time.
					currentTimestamp := makeTimestamp()
					if prevKey == keyId && prevKeyValue == keyValue {
						if currentTimestamp-timestamp > 500 {
							fmt.Println(currentTimestamp - timestamp)
							fmt.Println("Pass Key > 500")
							fmt.Println("<<")
							parseKey(keyId, keyValue, file.Keys, appConfig, fnPressed)
							fmt.Println(">>")
						}
						timepass++
						if timepass > 5 {
							timepass = 0
							fmt.Println("Pass Key - Timepass")
							// IF TIMESTAMP DIFFERENCE IS SHORT PASS MULTIPLIER TO PARSEKEY FUNC
							fmt.Println("<<")
							parseKey(keyId, keyValue, file.Keys, appConfig, fnPressed)
							fmt.Println(">>")
						}
						timestamp = currentTimestamp
					} else {
						fmt.Println("<<")
						parseKey(keyId, keyValue, file.Keys, appConfig, fnPressed)
						fmt.Println(">>")
					}
					prevKey = keyId
					prevKeyValue = keyValue
				}),
			)
			go rd.ListenTo(in)
		} else {
			fmt.Printf("Please close other apps that using %s\n", in.String())
		}

	} else {
		fmt.Println("No connected Loupedeck found")
	}

	scanner := bufio.NewScanner(os.Stdin)
	// fmt.Println("Try to press any key or rotate a knob on your Loupedeck")
	// fmt.Println("– or –")
	// fmt.Println("Press 'Ctrl' + 'C' or hit 'Enter' to close app")
	for scanner.Scan() {
		if scanner.Text() == "" {
			break
		}
		// if scanner.Text() == "config" {
		// 	// config()
		// }
		// fmt.Println(scanner.Text())
	}
}

func printPort(port midi.Port) {
	// fmt.Printf("[%v] %s\n", port.Number(), port.String())
}

func findPort(ports []midi.In, devices []string) int {
	for _, port := range ports {
		for _, device := range devices {
			if strings.Contains(port.String(), device) {
				return port.Number()
			}
		}
	}
	return -1
}

// func printInPorts(ports []midi.In) {
// 	fmt.Printf("MIDI IN Ports\n")
// 	for _, port := range ports {
// 		printPort(port)
// 	}
// 	fmt.Printf("\n")
// }
