const { app, BrowserWindow, Tray, Menu } = require('electron')

const path = require('path')
const isDev = require('electron-is-dev')

let mainWindow
let tray = null

delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900, height: 680,
    minWidth:400, minHeight: 400,
    webPreferences: {
      nodeIntegration: true
    } 
  })
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools()
  }

  tray = new Tray(isDev ? path.join(__dirname, '../assets/icon.ico') : path.join(app.getAppPath(), './assets/icon.ico'))
  // const contextMenu = Menu.buildFromTemplate([
  //   {
  //     label: 'Quit', click: () => {
  //       app.quit()
  //     }
  //   }
  // ])
  // tray.on('click', () => {
  //   mainWindow.show()
  // })
  // tray.setToolTip('Fyrlykt - Loupedeck with Resolve')
  // tray.setContextMenu(contextMenu)
  mainWindow.removeMenu()
  mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow)
app.allowRendererProcessReuse = true
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})