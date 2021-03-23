import { app, BrowserWindow, Tray, Menu, ipcMain, dialog, shell } from 'electron'
import { join } from 'path'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const isDev = process.env.NODE_ENV === 'development'

ipcMain.handle('getPath', async (event, value) => {
  const result = await app.getPath(value)
  return result
})
ipcMain.handle('getVersion', async () => {
  const result = await app.getVersion()
  return result
})

ipcMain.handle('openExternal', async (event, value) => {
  shell.openExternal(value)
})

ipcMain.handle('dialog', async (event, value) => {
  switch (value.method) {
    case 'openFile': 
      const openResult = await dialog.showOpenDialog(value.params)
      return openResult
    case 'saveFile':
      const saveResult = await dialog.showSaveDialog(value.params)
      // console.log(saveResult)
      return saveResult
    default:
      return null
  } 
})

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let tray = null

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 760,
    backgroundColor: '#242424',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // TRAY ICON
  // tray = new Tray(join(process.resourcesPath, 'icon.ico'))
  // const contextMenu = Menu.buildFromTemplate([
  //   {
  //     label: 'Quit', click: () => {
  //       app.quit()
  //     }
  //   }
  // ])
  // tray.on('click', () => {
  //   mainWindow?.show()
  // })
  // tray.setToolTip('React App')
  // tray.setContextMenu(contextMenu)
  // mainWindow.hide()
  // if (!isDev) {
  //   mainWindow.removeMenu()
  // }
  // mainWindow.on('minimize', (e:any) => {
  //   e.preventDefault()
  //   mainWindow?.hide()
  // })

  
  !isDev && mainWindow.removeMenu()

  // Show window when its ready to
  mainWindow.on('ready-to-show', () => mainWindow.show());
};

if (process.platform === 'darwin' && process.env.NODE_ENV === 'production') {
  const template = [
    {
      label: app.getName(),
      submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'hide' }, { role: 'hideothers' }, { role: 'unhide' }, { type: 'separator' }, { role: 'quit' }]
    },
    {
      label: 'Edit',
      submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectall' }]
    },
    {
      label: 'View',
      submenu: [{ role: 'togglefullscreen' }]
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template as any));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
