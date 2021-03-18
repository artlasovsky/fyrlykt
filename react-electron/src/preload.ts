console.log('-- preload.js loaded')
import { contextBridge, ipcRenderer } from 'electron'
import { spawn } from 'child_process'
import { join } from 'path'
import { copyFileSync, existsSync } from 'fs'
import { readFileSync, writeFileSync } from 'fs'

const forceDefaultAppConfig = true
const forceDefaultPanelConfig = false

const isDev = process.env.NODE_ENV === 'development'

const getPath = async (value: string) => {
  return await ipcRenderer.invoke('getPath', value)
}

const resourcesPath = isDev ? join(process.cwd(), 'resources') : process.resourcesPath
const defaultPanelConfig = join(resourcesPath, 'loupedeck.config.json')
const defaultAppConfig = join(resourcesPath, 'resolve.config.json')
const resolveShortcuts = join(resourcesPath, 'DaVinci Resolve.txt')

const updateAppConfigFromFile = (path: string):Shortcut[] => {
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
        .map(modifier => modifier.toLowerCase())
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
  // console.log(shortcuts)
  return shortcuts
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
    const appConfig:AppConfig = JSON.parse(readFileSync(defaultAppConfig, 'utf-8'))
    appConfig.shortcuts = [
      ...appConfig.shortcuts, 
      ...updateAppConfigFromFile(resolveShortcuts)
    ]
    writeFileSync(userAppConfig, JSON.stringify(appConfig, null, 2))
  }
}

configInit()


let corePID: number

const api = {
  core: {
    run: () => {
      const appPath = join(resourcesPath ,`/fyrlykt-core${process.platform === 'win32' ? '.exe' : ''}`)
      const loupedeckConfig = userPanelConfig
      const resolveConfig = userAppConfig
      const app = spawn(appPath, [loupedeckConfig, resolveConfig])
      app.stdout.on('data', data => console.log(String(data)))
      app.stderr.on('data', data => console.log(String(data)))
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
      console.log(pidIsRunning(pid))
      if (pidIsRunning(pid) && pid !== -1) {
        process.kill(pid)
      }
    }
  },
  config: {
    panel: () => JSON.parse(readFileSync(userPanelConfig, 'utf-8')) as PanelConfig,
    app: () => JSON.parse(readFileSync(userAppConfig, 'utf-8')) as AppConfig,
    writePanelConfig: (config: PanelConfig) => {
      // console.log(config)
      writeFileSync(userPanelConfig, JSON.stringify(config, null, 2))
    }
    // updateApp: (appConfig: AppConfig) => { 
    //   console.log(appConfig)
    //   // update config
    // }
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