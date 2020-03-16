import React, { useContext } from 'react'
import StoreContext, { Store } from '../store'

const Test = () => {
  const store = useContext(StoreContext) as Store
  const WebMidi = store.state.WebMidi
  if (WebMidi) {
    return (
      <div>
        {/* <p>{JSON.stringify(WebMidi.inputs)}</p> */}
        <button onClick={() => store.setters.setInput('testInput')}>setInput</button>
        <p>{JSON.stringify(store.state.config)}</p>
      </div>
    )
  } else {
    return <div>loading...</div>
  }
}

export default Test