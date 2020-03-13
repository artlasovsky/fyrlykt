import pyautogui, sys
import json

# print(json.dumps({"c": 0, "b": 0, "a": 0}, sort_keys=True))
print(json.dumps({'start': "true"}))
while True:
  inp = input()
  print(inp)
  data = json.loads(inp)
  command = data.get('command')
  params = data.get('params')
  if command != 'init':
    getattr(pyautogui, command)(*params)
  # else:
    # print(json.dumps({"start": "true"}))
  
  if command == 'close':
    print(json.dumps({'close': "true"}))
    break