import React from 'react'
import Midi from './components/Midi'
import StoreContext, { Store } from './store'

function App() {
  const store = Store()
  return (
    <div className="App">
      <StoreContext.Provider value={store}>
        <Midi />
      </StoreContext.Provider>
    </div>
  )
}

export default App