import { MainContext } from '@src/preload'
import logo from '@static/logo.png'
import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { ChildProcessWithoutNullStreams } from 'child_process'

const mainContext: MainContext = (window as any).api
const { core } = mainContext

const App = () => {
  const [counter, setCounter] = useState(0)

  const [corePID, setCorePID] = useState(null as null | number)

  const runCore = () => setCorePID(core.run())
  const killCore = () => corePID && core.kill(corePID)
  
  return <div className='container'>
  <h2 className='heading'>
    <img src={logo} width='32' title='Codesbiome' /> &nbsp; Electron React
    Webpack Typescript
  </h2>

  <p className='teaser' onClick={() => console.log(mainContext.fs.readdirSync(''))}>
    Minimal boilerplate for writing Desktop Applications using Electron,
    React, Webpack & TypeScript. This project makes use of latest packages
    like electron, react, typescript & webpack to serve the best
    environment for development.
  </p>
  <p className='versions'>
    <span className='version teaser'>
      Electron <span id='electron-version'></span>
    </span>
    &nbsp;&nbsp;
    <span className='version teaser'>
      Chrome <span id='chrome-version'></span>
    </span>
    &nbsp;&nbsp;
    <span className='version teaser'>
      Node <span id='node-version'></span>
    </span>
  </p>
  <p>
    Click below button to update the state (counter) using 🔥
    react-hot-loader (HMR). Component will not lose their state when
    modifying their source code.
    <br />
  </p>
  <button
    onClick={(): void =>
      setCounter(counter + 1)
    }
  >
    Counter &nbsp; <span>{counter}</span>
  </button>
  <button onClick={runCore}>Run Core</button>
  <button onClick={killCore}>Kill Core</button>
</div>
}

export default hot(module)(App);
