import { _config, _core } from '@src/state'
import { styled } from '@src/stitches.config'
import logo from '@static/logo.png'
import React, { useEffect, useState } from 'react'
import { hot } from 'react-hot-loader'
import { _Button, _ButtonGroup, _Divider, _Text } from './Elements'
import { PanelKeyList } from './PanelKeyList'
import { TopPane } from './TopPane'

const AppContainer = styled('div', {
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  // padding: '$normal',
  color: '$text'
})

const BottomPane = styled('div', {
  position: 'absolute',
  bottom: 0
})


const Select = () => {
  return <div></div>
}

const App = () => {

  const { app, editor } = _config()

  // Run Automatically while in Production
  // const { run } = _core()
  // useEffect(() => {
  //   run()
  // }, [])

  return <AppContainer>
    <TopPane />
    <PanelKeyList />
    <Select />
  </AppContainer>
}

export default hot(module)(App);
