import { coreState } from '@src/state'
import { styled } from '@src/stitches.config'
import logo from '@static/logo.png'
import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { useProxy } from 'valtio'

// //@ts-ignore
// const { core, fs }: MainContext = window.api

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
  const core = useProxy(coreState)
  const [counter, setCounter] = useState(0)

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
      <Button onClick={core.run}>Run Core</Button>
      <Button onClick={core.kill}>Kill Core</Button>
    </ButtonGroup>
  </AppContainer>
}

export default hot(module)(App);
