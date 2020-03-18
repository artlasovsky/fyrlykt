import React from 'react'
import './App.css'
import Midi from './components/Midi'
import StoreContext, { Store } from './store'

function App() {
  const store = Store()
  // useEffect(() => {
  //   if (!store.config.app) store.setters.loadConfig()
  // }, [store])
  return (
    <div className="App">
      <StoreContext.Provider value={store}>
        <Midi />
      </StoreContext.Provider>
    </div>
  )
}

export default App