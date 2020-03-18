import React, { useContext } from 'react'
import webmidi, { WebMidi } from 'webmidi'
import StoreContext, { Store } from '../store'
import Device from './Device'
import Panel from './Panel'

const Midi = () => {
  const store = useContext(StoreContext) as Store
  
  
  React.useEffect(() => {
    const enableMidi:Promise<WebMidi> = new Promise ((resolve, reject) => {
      webmidi.enable(err => {
        if (err) reject(err)
        else resolve(webmidi)
      }, true)
    })
    async function StartMidi() { 
      store.setters.setWebMidi(await enableMidi)
    }
    if (!store.webMidi.enabled) {
      StartMidi()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.webMidi])
  return (
      store.webMidi ?
      <div>
        <Device />
        <Panel />
      </div> 
      : 
      <div>
        'Midi is Loading...'
      </div>
  )
}

export default Midi