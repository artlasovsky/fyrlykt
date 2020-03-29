import pyautogui
import sys, json
import pygetwindow as gw


print("started")

while True:
  inp = input()
  if "{" in inp and "}" in inp:
    json_data = json.loads(inp)
    command = json_data.get('command')
    params = json_data.get('params')
    app = json_data.get('app')
    if (app in gw.getActiveWindow().title):
      print('send shortcut to ' + app)
      getattr(pyautogui, command)(*params)
    else:
      print(gw.getActiveWindow().title + ' is not ' + app)
  if inp == "test":
    print("testing")
  if inp == "activeWin":
    if sys.platform.startswith('win32'):
      print(gw.getActiveWindow().title)
    else:
      print(gw.getActiveWindow())
  if inp == "close":
    print("closing")
    break