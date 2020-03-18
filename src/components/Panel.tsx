import React, { useContext, useEffect, useState } from 'react'
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
      let fn = false
      console.log('panel loaded')
      // setFN(false)
      store.device.addListener('noteon', 'all', e => {
        // const keyID = e.data[1]
        const key = getKey(store.config, e, fn)
        if (key.instance.name === 'FN') {
          // console.log(FN)
          // setFN(true)
          fn = true
        }
        
        console.log(key)
        // const key = getKey
        // py.send({
          //   command: 'hotkey',
          //   params: ['alt', 'tab']
          // })
        })
      store.device.addListener('controlchange', 'all', e => {
        const key = getKey(store.config, e, fn)
        console.log(key)
        // console.log(e.data[1])
        // console.log(e.data[2])
      })
      store.device.addListener('noteoff', 'all', e => {
        const key = getKey(store.config, e, fn)
        if (key.instance.name === 'FN') {
          // setFN(false)
          fn = false
        }
      // console.log(e)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.device])
  
  return (
    <div>
      <p>Config App: {JSON.stringify(store.config.app)}</p>
      {/* <p>FN: {JSON.stringify(FN)}</p> */}
    </div>
  )
}

export default Panel