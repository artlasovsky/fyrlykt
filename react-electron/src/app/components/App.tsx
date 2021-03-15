import { configState, coreState } from '@src/state'
import { styled } from '@src/stitches.config'
import logo from '@static/logo.png'
import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { useProxy } from 'valtio'
import { Button, ButtonGroup } from './Elements'

const AppContainer = styled('div', {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$normal',
  color: '$text'
})

const App = () => {
  const core = useProxy(coreState)
  const [counter, setCounter] = useState(0)

  const { panel, app } = useProxy(configState)

  return <AppContainer>
    <h2 className='heading'>
      <img src={logo} width='32' title='Codesbiome' /> &nbsp; Electron React
      Webpack Typescript
    </h2>
    <p>{panel().name} - {app().displayName}</p>
    <ButtonGroup>
      <Button
        onClick={(): void =>
          setCounter(counter + 1)
        }
      >
        Counter &nbsp; <span>{counter}</span>
      </Button>
      <Button onClick={core.run}>Run Core</Button>
      <Button onClick={core.kill}>Kill Core</Button>
    </ButtonGroup>
  </AppContainer>
}

export default hot(module)(App);
