## Fyrlykt - Connect Loupedeck+ to DaVinci Resolve

Author: Art Lasovsky [(website)](https://artlasovsky.com)

Author of logo: Tanya Lasovsky [(tanya.lasovsky.com)](https://tanya.lasovsky.com)

Thanks for support and inspiration for:
``` Tanya Lasovsky, Neroud Suleiman (for first donation!), Loupedeck Dev Team, DaVinci Resolve users community and to all who made this awesome tools (Electron.js, React.js, TypeScript and more) which helps me to start this project ```

Support further development of this app [(paypal)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KACYGFTZSTPBW)

### Compatibility
I'm working and testing this app on Windows 10, but it should work on macOS too (all dependencies are cross platform)

### How to build
* Install JS dependencies ``` yarn ```

* Development Mode ``` yarn dev ```
* Build App ``` yarn dist ```

* If you want to rebuild python (v.3) Windows exec (it should work with macOS too)
  * Install PyInstaller (globally) ``` pip install pyinstaller ```
  * Create python virtual environment in "env" folder ``` py venv env ```
  * Activate virtual environment ``` {fyrlykt}\assets\python\env\scripts\activate ```
  * Install PyAutoGui ``` pip install pyautogui ```
  * Go back to the root of the project 
  * Build exec ``` yarn pydist ```


### Roadmap (in order of priority)
* Support for original Loupedeck
* UI improvements
  * Customize and style lists
  * Improve Selected Key design
  * Improve Active Shortcut Panel design
* Create own shortcuts
* Add support multiple user configurations
* Add support other midi devices
* Add support for Color Wheels [DaVinci Resolve]
* Add support for Page Switching [DaVinci Resolve]
* Support for Loupedeck CT