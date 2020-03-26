## Fyrlykt - Connect Loupedeck+ to DaVinci Resolve
_Readme is in process of filling_

Author: Art Lasovsky [(website)](https://artlasovsky.com)

Author of logo: Tanya Lasovsky [(tanya.lasovsky.com)](https://tanya.lasovsky.com)

Thanks for support and inspiration for:
``` Tanya Lasovsky, Neroud Suleiman, Loupedeck Dev Team ```

### Compatibility
I'm working and testing this app on Windows 10, but it should work on macOS too (all dependencies are cross platform)

### How to build
* Install JS dependencies ``` yarn ```

* Build Python exec
  * create python virtual environment in "env" folder ``` py venv env ```
  * activate virtual environment ``` {fyrlykt}\assets\python\env\scripts\activate ```
  * install PyAutoGui ``` pip install pyautogui ```
  * install PyInstaller ``` pip install pyinstaller ```
  * build exec ``` yarn pydist ```

* Development Mode ``` yarn dev ```
* Build App ``` yarn dist ```


### Roadmap
* UI improvements
* Add support multiple user configurations
* Add support other loupedeck devices
* Add support other midi panels
* Add support for Color Wheels [DaVinci Resolve] 
* Add support for Page Switching [DaVinci Resolve]