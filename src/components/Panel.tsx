import React, { useContext, useEffect } from 'react'
import StoreContext from '../store'
import { getKey, runCommand } from '../helpers/key'
import Editor from './Editor'

const Panel = () => {
  const { device, config, editMode, setters } = useContext(StoreContext)
  // SET INPUT
  useEffect(() => {
    if (device.name) {
      let fn = false
      console.log('panel loaded')
      device.addListener('noteon', 'all', e => {
        const key = getKey(config, e, fn)
        if (key.instance?.name === 'FN') fn = true
        if (key.instance) {
          editMode ? setters.setActiveKey(key.instance) : runCommand(key)
        }
      })
      device.addListener('controlchange', 'all', e => {
        const key = getKey(config, e, fn)
        // runCommand(key)
        if (key.instance) {
          editMode ? setters.setActiveKey(key.instance) : runCommand(key)
        }
      })
      device.addListener('noteoff', 'all', e => {
        const key = getKey(config, e, fn)
        if (key.instance?.name === 'FN') fn = false
      })
    }
    return () => {
      if (device.hasListener) device.removeListener()
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [device, editMode])

  return (
    <section className="panel">
      <button onClick={setters.toggleEditMode}>Config</button>
      {editMode ? 
        <Editor />
        :
        <div>activated</div>
      }
    </section>
  )
}

export default Panel