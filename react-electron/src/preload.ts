console.log('-- preload.js loaded')
import { contextBridge, ipcRenderer } from 'electron'
import { spawn } from 'child_process'
import { join } from 'path'
import { copyFileSync, existsSync } from 'fs'
import { readFileSync, writeFileSync } from 'fs'
import { UseToastOptions } from '@chakra-ui/react'

const forceDefaultAppConfig = false
const forceDefaultPanelConfig = false

const isDev = process.env.NODE_ENV === 'development'

const getVersion = async () => {
  return await ipcRenderer.invoke('getVersion', null)
}

const openExternal = async (link: string) => {
  await ipcRenderer.invoke('openExternal', link)
}

const getPath = async (value: string) => {
  return await ipcRenderer.invoke('getPath', value)
}

const openFile = async (filters: { name: string, extensions: string[] }[]) => {
  return await ipcRenderer.invoke('dialog', { 
    method: 'openFile', 
    params: { properties: ['openFile'], filters } 
  })
}
const saveFile = async (options: { title?: string, buttonLabel?: string, defaultPath?: string, filters?: { name: string, extensions: string[] }[] } ) => {
  return await ipcRenderer.invoke('dialog', {
    method: 'saveFile',
    params: options
  })
}

const resourcesPath = isDev ? join(process.cwd(), 'resources') : process.resourcesPath
const defaultPanelConfig = join(resourcesPath, 'loupedeck.config.json')
const defaultAppConfig = join(resourcesPath, 'resolve.config.json')
const resolveShortcuts = join(resourcesPath, 'DaVinci Resolve.txt')

const updateAppShortcutsFromFile = async (path: string, byUser: boolean = false) => {
  const appConfig:AppConfig = JSON.parse(readFileSync(defaultAppConfig, 'utf-8'))
  const userData = await getPath('userData')
  const userAppConfig = join(userData, 'resolve.config.json')
  const file = readFileSync(path, 'utf-8')
  const lines = file.split('\n').filter(line => !(['#', '', '\r'].includes(line[0])))
    .map(line => {
      const [shortcutPath, value = null] = line.split(':=').map(line => line.trim())
      // viewColorPickerPixelBitDepthCycle
      const category = shortcutPath.split(/(?=[A-Z])/).map(part => part.trim())[0]
      const name = shortcutPath.split(/(?=[A-Z])/).map(part => part.trim()).slice(1).join(' ')
      // const [category, name] = shortcutPath.split(/(?=[A-Z])/).map(part => part.trim())
      if (category && name && value?.length) {
        const formattedValue = value.split(' | ')[0]
        return {
          category: category,
          name,
          value: formattedValue
        }
      }
    })
    .filter(shortcut => shortcut != undefined) as Shortcut[]
  const shortcuts: Shortcut[] = lines.map(line => {
    const shortcut = line.value.replace("Num+", "Num").split('+')
      const modifiers = shortcut.slice(0, -1)
        .map(modifier => {
          modifier.toLowerCase()
        })
      const [ key ] = shortcut.slice(-1).map(key => key.toLowerCase())
      let value
      if (modifiers.length) {
        value = `{${[key, ...modifiers].join('++')}}`
      } else {
        value = `[${key}]`
      }

      return {
        category: line.category.charAt(0).toUpperCase() + line.category.slice(1),
        name: line.name,
        value
      }
  })
  // Mac OS replace Ctrl to Cmd
  if (process.platform === 'darwin') {
    appConfig.shortcuts = appConfig.shortcuts.map(s => ({...s, value: s.value.replace('ctrl', 'cmd')}))
  }
  appConfig.shortcuts.push(...shortcuts)
  appConfig.byUser = byUser

  writeFileSync(userAppConfig, JSON.stringify(appConfig, null, 2))
}

let userPanelConfig = ''
let userAppConfig = ''

const configInit = async () => {
  console.log('config init')
  const userData = await getPath('userData')
  // console.log(userData)
  userPanelConfig = join(userData, 'loupedeck.config.json')
  userAppConfig = join(userData, 'resolve.config.json')
  if (!existsSync(userPanelConfig) || forceDefaultPanelConfig) {
    console.log('-- copy default panel config')
    copyFileSync(defaultPanelConfig, userPanelConfig)
  } 
  if (!existsSync(userAppConfig) || forceDefaultAppConfig) {
    console.log('-- copy default app config')
    console.log(userAppConfig)
    updateAppShortcutsFromFile(resolveShortcuts)
  }
}

configInit()


let corePID: number


const sendCoreMessage = ({ title, status, description }: UseToastOptions) => {
  const message: UseToastOptions = {
    title,
    status,
    description,
    // duration: 4800,
    isClosable: true
  }
  window.postMessage({ id: 'core', message}, '*')
}


const api = {
  core: {
    run: () => {
      const appPath = join(resourcesPath ,`/fyrlykt-core${process.platform === 'win32' ? '.exe' : ''}`)
      const loupedeckConfig = userPanelConfig
      const resolveConfig = userAppConfig
      const app = spawn(appPath, [loupedeckConfig, resolveConfig])
      app.stdout.on('data', data => {
        const message = String(data)
        console.log(message)
        // console.log(message.includes('Loupedeck'))
        if (message.includes('No connected Loupedeck found')) {
          sendCoreMessage({
            title: 'Fyrlykt Core',
            status: 'error',
            description: 'Loupedeck is not connected',
            isClosable: true
          })
          api.core.kill(app.pid)
        }
        if (message.includes('Run Reader')) {
          sendCoreMessage({
            title: 'Fyrlykt Core - Started!',
            status: 'success',
            description: 'You can use Resolve with Loupedeck now',
            isClosable: true
          })
        }
      })
      app.stderr.on('data', data => {
        const message = String(data)
        // console.log(String(data))
        sendCoreMessage({
          title: 'Core Error',
          status: 'warning',
          description: message,
          isClosable: true
        })
      })
      app.on('close', () => console.log('core is closed'))
      corePID = app.pid
      return app.pid
    },
    kill: (pid: number) => {
      function pidIsRunning(pid:number) {
        try {
          process.kill(pid, 0);
          return true;
        } catch(e) {
          return false;
        }
      }
      // console.log(pidIsRunning(pid))
      if (pidIsRunning(pid) && pid !== -1) {
        process.kill(pid)
        window.postMessage({ id: 'pid', message: -1 }, '*')
      }
    }
  },
  config: {
    panel: () => JSON.parse(readFileSync(userPanelConfig, 'utf-8')) as PanelConfig,
    app: () => JSON.parse(readFileSync(userAppConfig, 'utf-8')) as AppConfig,
    writePanelConfig: (config: PanelConfig) => {
      // console.log(config)
      writeFileSync(userPanelConfig, JSON.stringify(config, null, 2))
    },
    updateAppShortcuts: async () => {
      const dialog = await openFile([{ name: 'Resolve Keyboard Config (*.txt)', extensions: ['txt'] }])
      if (!dialog.canceled) {
        const path = await dialog.filePaths[0]
        await updateAppShortcutsFromFile(path, true)
        // console.log(userAppConfig)
        return true
      }
      return false
    },
    resetAppShortcuts: async () => {
      await updateAppShortcutsFromFile(resolveShortcuts)
      return true
    },
    exportPanelConfig: async () => {
      const dialog = await saveFile({ title: 'Save Fyrlykt Panel Config', defaultPath: 'loupedeck.config.json', filters: [
        { name: 'Fyrlykt Loupedeck Config File', extensions: ['config.json'] }
      ]})
      // console.log(dialog)
      if (!dialog.canceled) {
        const path = dialog.filePath
        writeFileSync(path, JSON.stringify(api.config.panel(), null, 2))
        const message: UseToastOptions = {
          title: 'Panel Config Export - Done!',
          status: 'success',
          // description: 'No connected Loupedeck found',
          // duration: 4800,
          isClosable: true
        }
        window.postMessage({ id: 'core', message}, '*')
        return true
      }
      return false
    },
    importPanelConfig: async () => {
      const dialog = await openFile([{ name: 'Fyrlykt Panel Config Config (*.json)', extensions: ['config.json'] }])
      if (!dialog.canceled) {
        const path = dialog.filePaths[0]
        copyFileSync(path, userPanelConfig)
        const message: UseToastOptions = {
          title: 'Panel Config Import - Done!',
          status: 'success',
          // description: 'No connected Loupedeck found',
          // duration: 4800,
          isClosable: true
        }
        window.postMessage({ id: 'core', message}, '*')
        return true
      }
      return false
    }
    // updateApp: (appConfig: AppConfig) => { 
    //   console.log(appConfig)
    //   // update config
    // }
  },
  app: {
    getVersion,
    platform: process.platform === 'win32' ? 'windows' : 'macos',
    openExternal
  }
}

export type MainContext = typeof api

contextBridge.exposeInMainWorld(
  'api', api
)


window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  // Packages version
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(
      `${type}-version`,
      process.versions[type as keyof typeof process.versions],
    );
  }
});