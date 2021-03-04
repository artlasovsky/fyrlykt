console.log('preload.js says 🎉hoooraay!')
import { contextBridge } from 'electron'
import fs from 'fs'
import { spawn } from 'child_process'
import { join } from 'path'

const isDev = process.env.NODE_ENV === 'development'

const api = {
  test: () => console.log('test from preload'),
  fs,
  spawn,
  join,
  rootDir: isDev ? join(process.cwd(), 'src') : process.cwd(),
  core: {
    run: () => {
      const appPath = join(process.cwd(), 'src', 'resources/fyrlykt-core.exe')
      const loupedeckConfig = join(process.cwd(), 'src', 'resources/loupdeck.config.json')
      const resolveConfig = join(process.cwd(), 'src', 'resources/resolve.config.json')
      const app = spawn(appPath, [loupedeckConfig, resolveConfig])
      app.stdout.on('data', data => console.log(String(data)))
      app.stderr.on('data', data => console.log(String(data)))
      app.on('exit', () => console.log('core is closed'))
      return app.pid
    },
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