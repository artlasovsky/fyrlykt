import { MainContext } from '@src/preload'
import { styled } from '@src/stitches.config'
import logo from '@static/logo.png'
import React, { useState } from 'react'
import { hot } from 'react-hot-loader'

//@ts-ignore
const { core, fs }: MainContext = window.api

const ButtonGroup = styled('div', {
  display: 'flex',
  variants: {
    direction: {
      horizontal: {
        '> button': {
          '&:not(:first-child)': {
            marginLeft: '1em'
          }
        }
      },
      vertical: {

      }
    }
  },
  defaultVariants: {
    direction: 'horizontal'
  }
})

const AppContainer = styled('div', {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$normal',
  color: '$text'
})

const Button = styled('button', {
  backgroundColor: '$buttonBg',
  color: '$text',
  border: 'none',
  padding: '$normal',
  borderRadius: '$normal',
  fontSize: '$base',
  outline: 'none',
  minWidth: '10rem',
  '&:hover, &:active': {
    filter: 'brightness(120%)'
  }
})

const App = () => {
  const [counter, setCounter] = useState(0)

  const [corePID, setCorePID] = useState(null as null | number)

  const runCore = () => setCorePID(core.run())
  const killCore = () => corePID && core.kill(corePID)
  
  return <AppContainer>
    <h2 className='heading'>
      <img src={logo} width='32' title='Codesbiome' /> &nbsp; Electron React
      Webpack Typescript
    </h2>
    <ButtonGroup>
      <Button
        onClick={(): void =>
          setCounter(counter + 1)
        }
      >
        Counter &nbsp; <span>{counter}</span>
      </Button>
      <Button onClick={runCore}>Run Core</Button>
      <Button onClick={killCore}>Kill Core</Button>
    </ButtonGroup>
  </AppContainer>
}

export default hot(module)(App);
