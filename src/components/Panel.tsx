import React, { useContext } from 'react'
import StoreContext, { Store } from '../store'
import { Input } from 'webmidi'
import { PythonShell } from 'python-shell'
import { join } from 'path'
import { remote } from 'electron'


const Panel = () => {
  const store = useContext(StoreContext) as Store
  const input = store.getters.getInput() as Input
  
  // PYTHON
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
  //key resolver
  //shortcut resolver

  // input.addListener('noteon', 'all', e => {
  //   const keyID = e.data[1]
  //   // const key = getKey
  // })
  // input.addListener('controlchange', 'all', e => {
  //   const keyID = e.data[1]
  // })
  // input.addListener('noteoff', 'all', e => {
  //   const keyID = e.data[1]
  //   // if () getKey(state.app, keyID, state.fn).name === 'FN' => setFN(true)
  // })
  py.send({
    command: 'init',
    params: []
  })
  const test = () => {
    // SWITCH TO APP OR CHECK CURRECT PROCESS ?
    py.send({
      command: 'hotkey',
      params: ['alt', 'tab']
    })
  }
  return (
    <div>
      <p>Input: {input}</p>
      {/* <p>{JSON.stringify(config)}</p> */}
      <button onClick={() => test()}>shortcut</button>
    </div>
  )
}

export default Panel