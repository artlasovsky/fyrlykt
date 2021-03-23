import { globalStyles } from '@src/stitches.config'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

import { ChakraProvider } from "@chakra-ui/react"
import { theme } from '@src/chackra.theme'

/** App & Global Styles from Stitches */
// globalStyles()
ReactDOM.render(
<ChakraProvider theme={theme}>
  <App />
</ChakraProvider>
,document.getElementById('app'));

/** Hot Module Replacement */
if (process.env.NODE_ENV == 'development' && module.hot) {
  module.hot.accept()
}