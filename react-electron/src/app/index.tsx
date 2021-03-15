import { globalStyles } from '@src/stitches.config'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

/** App & Global Styles from Stitches */
globalStyles()
ReactDOM.render(<App />, document.getElementById('app'));

/** Hot Module Replacement */
if (process.env.NODE_ENV == 'development' && module.hot) {
  module.hot.accept()
}