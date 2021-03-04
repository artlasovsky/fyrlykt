console.log('preload.js says 🎉hoooraay!')
import { contextBridge, app } from 'electron'
import fs from 'fs'
import { spawn } from 'child_process'
import { join } from 'path'

const isDev = process.env.NODE_ENV === 'development'

const initialConfigFiles = () => {
  const loupedeckConfig = {} 
  const resolveConfig = {} // Custom Commands + Parsed from Resolve Shortcuts list
  const userData = app.getPath('userData')

  // Shortcuts depends on system
  // create config files from defaults if it not yet exists
}

let corePID: number

const resourcesPath = isDev ? join(process.cwd(), 'resources') : process.resourcesPath

const api = {
  test: () => console.log('test from preload'),
  fs,
  spawn,
  join,
  core: {
    run: () => {
      const appPath = join(resourcesPath ,`/fyrlykt-core${process.platform === 'win32' ? '.exe' : ''}`)
      const loupedeckConfig = join(resourcesPath, 'loupedeck.config.json')
      const resolveConfig = join(resourcesPath, 'resolve.config.json')
      const app = spawn(appPath, [loupedeckConfig, resolveConfig])
      app.stdout.on('data', data => console.log(String(data)))
      app.stderr.on('data', data => console.log(String(data)))
      app.on('exit', () => console.log('core is closed'))
      corePID = app.pid
      return app.pid
    },
    test: () => console.log(corePID),
    kill: (pid: number) => process.kill(pid)
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