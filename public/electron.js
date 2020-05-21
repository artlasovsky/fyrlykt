const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')
const { spawn } = require('child_process')

const path = require('path')
const isDev = require('electron-is-dev')

let mainWindow
let tray = null

delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

const startServer = () => {
  const assets = app.isPackaged ? path.join(process.resourcesPath, './assets/go') : './assets/go'
  const goApp = spawn(path.join(assets, 'fyrlykt'))
  goApp.on('error', err => console.log(err))
  goApp.on('close', () => console.log('closed'))
  goApp.on('exit', (exitCode) => console.log(`Exited with ${exitCode}`))
  if (!app.isPackaged) {
    goApp.stdout.on('data', data => {
      console.log(data.toString())
    })
  }
  ipcMain.on('shortcut', (event, shortcut) => {
    // console.log(JSON.stringify(shortcut) + '\n')
    goApp.stdin.write(JSON.stringify(shortcut) + '\n')
    // event.reply('response', shortcut)
  })
} 

function createWindow() {

  startServer()

  mainWindow = new BrowserWindow({
    width: 1000, height: 600,
    minWidth: 900, minHeight: 600,
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
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit', click: () => {
        app.quit()
      }
    }
  ])
  tray.on('click', () => {
    mainWindow.show()
  })
  tray.setToolTip('Fyrlykt - Loupedeck with Resolve')
  tray.setContextMenu(contextMenu)
  mainWindow.hide()
  mainWindow.on('minimize', e => {
    e.preventDefault()
    mainWindow.hide()
  })
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