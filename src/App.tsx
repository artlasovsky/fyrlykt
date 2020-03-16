import React, { useContext } from 'react'
import './App.css'
import Midi from './components/Midi'
import Inputs from './components/Inputs'
import StoreContext, { Store } from './store'
import Panel from './components/Panel'
import fs from 'fs'
import { join } from 'path'
import { remote } from 'electron'

function App() {
  console.log(remote.app.getAppPath())
  const configPath = 
    remote.app.isPackaged ? 
      join(process.resourcesPath, './assets/loupedeck.json')
      : 
      './assets/loupedeck.json' 
  
  const initial = {
    config: JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  }
  console.log(initial)
  const store = Store({...useContext(StoreContext), ...initial})
  return (
    <div className="App">
      <StoreContext.Provider value={store}>
        <Midi />
        <Inputs />
        <Panel />
      </StoreContext.Provider>
    </div>
  )
}

export default App