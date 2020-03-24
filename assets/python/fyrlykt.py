# import pyautogui, sys
# import json

# # print(json.dumps({"c": 0, "b": 0, "a": 0}, sort_keys=True))
# print(json.dumps({'start': "true"}))
# while True:
#   inp = input()
#   print(inp)
#   data = json.loads(inp)
#   command = data.get('command')
#   params = data.get('params')
#   if command != 'init':
#     getattr(pyautogui, command)(*params)
#   # else:
#     # print(json.dumps({"start": "true"}))
  
#   if command == 'close':
#     print(json.dumps({'close': "true"}))
#     break

import pyautogui
import sys, json
import pygetwindow as gw


print("started")

while True:
  inp = input()
  print(inp)
  if "{" in inp and "}" in inp:
    print("JSON")
    json_data = json.loads(inp)
    command = json_data.get('command')
    params = json_data.get('params')
    getattr(pyautogui, command)(*params)
  if inp == "test":
    print("testing")
  if inp == "activeWin":
    print(gw.getActiveWindow().title)
  if inp == "close":
    print("closing")
    break