import { remote } from 'electron'
import { join } from 'path'
import { PythonShell } from 'python-shell'

const assetsPath = remote.app.isPackaged ? join(process.resourcesPath, './assets/python') : './assets/python'
let pythonPath = ''
if (process.platform === 'win32') {
  pythonPath = join(assetsPath, 'win/Scripts/python.exe')
} else if (process.platform === 'darwin') {
  pythonPath = join(assetsPath, 'mac/bin/python3')
}
const py = new PythonShell(join(assetsPath, 'keyboard.py'), { pythonPath, mode: 'json' })
py.on('message', (data: any, err: Error) => {
  err ? console.error(err) : console.log(`[PYTHON]\n${JSON.stringify(data)}`)
})

export default py