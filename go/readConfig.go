package main

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

type Key struct {
	Id    int
	Name  string
	Value []string
	Fn    []string
}
type Panel struct {
	Name string
	Keys []Key
}

type Shortcut struct {
	Category string
	Name     string
	Value    string
}

type AppConfig struct {
	Name      string
	Shortcuts []Shortcut
}

// func config(file File) {
// 	// _, configJSON := readJSON("loupedeck.config.json")
// 	// file := parseConfigJSON(configJSON)
// 	keys := file.Keys
// 	f, s := searchKey(95, keys)
// 	if f {
// 		fmt.Println(s.Name)
// 	}
// }

func readJSON(path string) (error, []byte) {
	jsonFile, err := os.Open(path)
	if err != nil {
		return err, nil
	}
	defer jsonFile.Close()
	configJSON, _ := ioutil.ReadAll(jsonFile)
	return err, configJSON
}

func parseConfigJSON(jsonFile []byte) Panel {
	var file Panel
	json.Unmarshal([]byte(jsonFile), &file)
	return file
}

func parseAppConfig(jsonFile []byte) AppConfig {
	var file AppConfig
	json.Unmarshal([]byte(jsonFile), &file)
	return file
}

func searchKey(value int, array []Key) (bool, Key) {
	for _, v := range array {
		if v.Id == value {
			return true, v
		}
	}
	return false, Key{}
}

func searchShortcut(category string, name string, shortcuts []Shortcut) (bool, string) {
	for _, v := range shortcuts {
		if v.Category == category && v.Name == name {
			return true, v.Value
		}
	}
	return false, ""
}
