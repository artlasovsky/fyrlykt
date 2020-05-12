import React, { useContext, useEffect } from 'react'
import webmidi, { WebMidi } from 'webmidi'
import StoreContext, { Store } from '../store'
import Panel from './Panel'
import Menu from './Menu'

const Midi = () => {
  const { webMidi, setters: { setWebMidi, loadConfig, setDevice }, config, device } = useContext(StoreContext) as Store
  
  useEffect(() => {
    const enableMidi:Promise<WebMidi> = new Promise ((resolve, reject) => {
      webmidi.enable(err => {
        if (err) reject(err)
        else resolve(webmidi)
      }, true)
    })
    async function StartMidi() { 
      setWebMidi(await enableMidi)
    }
    if (!webMidi.enabled) {
      StartMidi()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webMidi])

  useEffect(() => {
    if (!config.app) {
      loadConfig()
    }
    setDevice('Loupedeck+')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[webMidi])

  return (
    <>
      {/* <div className="not-connected">
        <h3>Loupedeck+ is not connected</h3>
        <p>Connect it to your computer, and make sure that original Loupedeck utility is closed.</p>
        <p>Then press "Try to Connect" again</p>
        <button onClick={() => window.location.reload()}>Try to Connect Loupedeck</button>
      </div> */}
      {
        webMidi && device ?
        <div className="midi">
          <Menu />
          <Panel />
        </div>
        :
        <div className="not-connected">
          <h3>Can't find Loupedeck+</h3>
          <p>Connect it to your computer, and make sure that the original Loupedeck utility is closed.</p>
          <p>Then press "Try to Connect" again</p>
          <button className="button" onClick={() => window.location.reload()}>Try to Connect</button>
        </div>
      }
    </>
      // : 
      // <div className="not-connected">
      //   <h3>Loupedeck+ is not connected</h3>
      //   <p>Connect it to your computer, and make sure that original Loupedeck utility is closed.</p>
      //   <p>Then press "Try to Connect" again</p>
      //   <button onClick={() => window.location.reload()}>Try to Connect Loupedeck</button>
      // </div>
  )
}

export default Midi