import React, { useContext, useEffect } from 'react'
import StoreContext, { Store } from '../store'

const Device = () => {
  const { device, config, webMidi, editMode, setters: { toggleEditMode, loadConfig, setDevice, resetConfig }, getters: { userConfig } } = useContext(StoreContext) as Store
  
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
        <p>{device.name}</p>
        <div className="splitter"></div>
        <p className="app">{config.appDisplayName}</p>
        <div className="splitter"></div>
        <div className="button-group">
          <button onClick={toggleEditMode}>{editMode ? 'Activate' : 'Configure Panel'}</button>
          <button onClick={() => window.location.reload()}>Refresh App</button>
        </div>
        {userConfig && <div className="splitter"></div>}
        {userConfig && <p className="link" onClick={resetConfig}>Reset to default config</p>}
      </div>
    )
  } else {
    return <div>loading...</div>
  }
}

export default Device