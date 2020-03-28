import React, { useContext } from 'react'
import webmidi, { WebMidi } from 'webmidi'
import StoreContext, { Store } from '../store'
// import Device from './Device'
import Panel from './Panel'
import Menu from './Menu'

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
      store.webMidi && store.device ?
      <div className="midi">
        <Menu />
        <Panel />
      </div> 
      : 
      <div className="not-connected">
        <p>'Loupedeck is not connected'</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
  )
}

export default Midi