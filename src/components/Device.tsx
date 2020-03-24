import React, { useContext, useEffect } from 'react'
import StoreContext, { Store } from '../store'

const Device = () => {
  const { device, config, webMidi, setters: { loadConfig, setDevice } } = useContext(StoreContext) as Store
  
  useEffect(() => {
    if (!config.app) {
      loadConfig()
    }
    setDevice('Loupedeck+')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[webMidi])

  if (webMidi) {
    return (
      <div className="device">
        <p>Connected: {JSON.stringify(device.name)}</p>
        <p>Config App: {JSON.stringify(config.app)}</p>
      </div>
    )
  } else {
    return <div>loading...</div>
  }
}

export default Device