import React, { useContext, useEffect } from 'react'
import StoreContext from '../store'
// import { Input } from 'webmidi'
// import { PythonShell } from 'python-shell'
// import { join } from 'path'
// import { remote } from 'electron'
import py from '../helpers/py'
import getKey from '../helpers/getKey'

const Panel = () => {
  const store = useContext(StoreContext)
  
  // SET INPUT
  useEffect(() => {
    if (store.device.name) {
      console.log('panel loaded')
      store.device.addListener('noteon', 'all', e => {
        // const keyID = e.data[1]
        const key = getKey(store.config, e, store.FN)
        if (key.name === 'FN') store.setters.setFN(true)
        else {
          console.log(key)  
        }
        // const key = getKey
        // py.send({
          //   command: 'hotkey',
          //   params: ['alt', 'tab']
          // })
        })
      store.device.addListener('controlchange', 'all', e => {
        const key = getKey(store.config, e, store.FN)
        console.log(key)
        // console.log(e.data[1])
        // console.log(e.data[2])
      })
      store.device.addListener('noteoff', 'all', e => {
        if (getKey(store.config, e, store.FN).name === 'FN') store.setters.setFN(false)
      // console.log(e)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.device])
  
  return (
    <div>
      <p>Config App: {JSON.stringify(store.config.app)}</p>
      <p>FN: {JSON.stringify(store.FN)}</p>
    </div>
  )
}

export default Panel