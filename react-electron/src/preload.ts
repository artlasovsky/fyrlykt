console.log('-- preload.js loaded')
import { contextBridge, ipcRenderer } from 'electron'
import { spawn } from 'child_process'
import { join } from 'path'
import { copyFileSync, existsSync } from 'fs'
import { readFileSync } from 'fs'

const isDev = process.env.NODE_ENV === 'development'

const getPath = async (value: string) => {
  return await ipcRenderer.invoke('getPath', value)
}

const resourcesPath = isDev ? join(process.cwd(), 'resources') : process.resourcesPath
const defaultPanelConfig = join(resourcesPath, 'loupedeck.config.json')
const defaultAppConfig = join(resourcesPath, 'resolve.config.json')

let userPanelConfig = ''
let userAppConfig = ''

const configInit = async () => {
  console.log('config init')
  const userData = await getPath('userData')
  // console.log(userData)
  userPanelConfig = join(userData, 'loupedeck.config.json')
  userAppConfig = join(userData, 'resolve.config.json')
  if (!existsSync(userPanelConfig) || isDev) {
    console.log('-- copy default panel config')
    copyFileSync(defaultPanelConfig, userPanelConfig)
  } 
  if (!existsSync(userAppConfig) || isDev) {
    console.log('-- copy default app config')
    copyFileSync(defaultAppConfig, userAppConfig)
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
      app.on('exit', () => console.log('core is closed'))
      corePID = app.pid
      return app.pid
    },
    kill: (pid: number) => process.kill(pid)
  },
  config: {
    panel: () => JSON.parse(readFileSync(userPanelConfig, 'utf-8')) as PanelConfig,
    app: () => JSON.parse(readFileSync(userAppConfig, 'utf-8')) as AppConfig
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