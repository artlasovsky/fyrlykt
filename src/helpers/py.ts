import { remote } from 'electron'
import { join } from 'path'
import { spawn } from 'child_process'

const python = remote.app.isPackaged ? join(process.resourcesPath, './assets/python') : './assets/python/dist'
const pyApp = spawn(join(python, 'fyrlykt'))
//`${process.platform === 'win32' ? 'fyrlykt' : 'fyrlykt'}`

pyApp.on('error', err => console.log(err))
pyApp.on('close', () => console.log('closed'))
pyApp.stdout.on('data', data => console.log(data.toString()))

export const send = (value: string) => {
  pyApp.stdin.write(value + '\n')
}