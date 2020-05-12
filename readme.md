## Fyrlykt - Connect Loupedeck+ to DaVinci Resolve
_tested on Windows 10 (should build and work on macOS, and even Linux)_

Author: Art Lasovsky [(website)](https://artlasovsky.com)

Author of logo: Tanya Lasovsky [(tanya.lasovsky.com)](https://tanya.lasovsky.com)

Thanks for support and inspiration for:
``` Tanya Lasovsky, Neroud Suleiman (for first donation!), Loupedeck Dev Team, DaVinci Resolve users community and to all who made this awesome tools (Electron.js, React.js, TypeScript and more) which helps me to start this project ```

Support further development of this app [(paypal)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KACYGFTZSTPBW)

### Compatibility
I'm working and testing this app on Windows 10, but it should work on macOS too (all dependencies are cross platform), 
I tried to build it on virtual machine with macOS, but it fails...
So if you have build it for macOS, please share it with others.
!Important - you need to close original 'Loupedeck Setup Panel' because it's not possible to use two apps with one midi-device

### What it can do?
* I have saved all standard Resolve shortcuts and it available for binding to any key.
* Application is sending this shortcuts only to DaVinci Resolve
* It converts windows shortcuts to macOS compatible (changing 'ctrl' and 'alt' to 'command' and 'option')
* It starts minimized and located in tray

```
To save shortcut for key:
- Set application to 'config' mode ('Configure Panel' button)
- Press any button or turn the knob and it will be showed in top left panel
- If button has shortcut it will shown on top right panel
- You can select other shortcut from list below and click save
- Application will save your changes locally
- Don't forget to 'activate' app back to being able to use it with Resolve
```

### How to build
* Install JS dependencies ``` yarn ```

* Build Go binary
  * Install Go
  * ``` cd .\assets\go ```
  * to run ``` go run . ```
  * to build binary ``` go build . ```
* Development Mode ``` yarn dev ```
* Build App ``` yarn dist ```


### Changes
* Move to Golang (from Python)
* Fix issues with "FN + Knob" shortcuts
* UI Improvements
* Added "new version" notifications
* Started testing (not in production yet) custom controls for other Resolve functions (mainly in the Color Page at this moment...)

### Roadmap (in order of priority)
* Fixes:
  * Fix double scroll on HSL wheels
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