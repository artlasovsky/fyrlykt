import React, { useContext, useEffect } from 'react'
import StoreContext from '../store'
import { getKey, runCommand } from '../helpers/key'
import Editor from './Editor'

const Panel = () => {
  const { device, config, editMode, setters: { setActiveKey } } = useContext(StoreContext)
  useEffect(() => {
    if (device.name) {
      const keyGetter = (e:any) => {
        const keyEvent = Array.from(e.data).splice(1, 2) as Array<number>
        return getKey(config, keyEvent, fn)
      }
      const listenerAction = (e:any) => {
        const key = keyGetter(e)
        if (key.instance?.name === 'FN') fn = true
        if (key.instance) {
          editMode ? setActiveKey(key.instance) : runCommand(key, config.app)
        }
      }
      let fn = false
      console.log('panel loaded')
      device.addListener('noteon', 'all', e => listenerAction(e))
      device.addListener('controlchange', 'all', e => listenerAction(e))
      device.addListener('noteoff', 'all', e => { if (keyGetter(e).instance?.name === 'FN') fn = false })
    }
    return () => {
      if (device.hasListener) device.removeListener()
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [device, editMode, config])

  return (
    <section className="panel">
      {editMode ? 
        <Editor />
        :
        <div>Activated</div>
      }
    </section>
  )
}

export default Panel