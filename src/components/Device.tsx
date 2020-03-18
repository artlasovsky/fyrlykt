import React, { useContext, useEffect } from 'react'
import StoreContext, { Store } from '../store'

const Device = () => {
  const store = useContext(StoreContext) as Store
  
  useEffect(() => {
    if (!store.config.app) {
      store.setters.loadConfig()
    }
    store.setters.setDevice('Loupedeck+')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[store.webMidi])
  
  if (store.webMidi) {
    return (
      <div>Connected: {JSON.stringify(store.device.name)}</div>
    )
  } else {
    return <div>loading...</div>
  }
}

export default Device