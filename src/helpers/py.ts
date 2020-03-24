import { remote } from 'electron'
import { join } from 'path'
import { spawn } from 'child_process'
// import { PythonShell } from 'python-shell'

// const assetsPath = remote.app.isPackaged ? join(process.resourcesPath, './assets/python') : './assets/python'
// let pythonPath = ''
// if (process.platform === 'win32') {
//   pythonPath = join(assetsPath, 'win/Scripts/python.exe')
// } else if (process.platform === 'darwin') {
//   pythonPath = join(assetsPath, 'mac/bin/python3')
// }
// const py = new PythonShell(join(assetsPath, 'keyboard.py'), { pythonPath, mode: 'json' })
// py.on('message', (data: any, err: Error) => {
//   err ? console.error(err) : console.log(`[PYTHON]\n${JSON.stringify(data)}`)
// })

const python = remote.app.isPackaged ? join(remote.app.getAppPath(), './assets/python') : './assets/python'
const pyApp = spawn(join(python, 'fyrlykt'))
//`${process.platform === 'win32' ? 'fyrlykt' : 'fyrlykt'}`

pyApp.on('error', err => console.log(err))
pyApp.on('close', () => console.log('closed'))
pyApp.stdout.on('data', data => console.log(data.toString()))

export const send = (value: string) => {
  pyApp.stdin.write(value + '\n')
}

// export default py