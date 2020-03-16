import React, { useContext } from 'react'
import webmidi, { WebMidi } from 'webmidi'
import StoreContext, { Store } from '../store'

const Midi = () => {
  const store = useContext(StoreContext) as Store
  
  const enableMidi:Promise<WebMidi> = new Promise ((resolve, reject) => {
    webmidi.enable(err => {
      if (err) reject(err)
      else resolve(webmidi)
    }, true)
  })
  
  React.useEffect(() => {
    async function StartMidi() { 
      store.setters.setWebMidi(await enableMidi)
    }
    StartMidi()
  }, [enableMidi, store])
  return (
    <div>
      {JSON.stringify(store.state.WebMidi ? store.state.WebMidi.enabled : 'Midi is Loading...')}
    </div>
  )
}

export default Midi