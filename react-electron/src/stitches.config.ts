import { createCss } from '@stitches/react'

export const { styled, global } = createCss({
  theme: {
    colors: {
      dark: '#1f1f1f',
      inputBg: '#1d1d1d',
      bodyBg: '#242424',
      buttonBg: '#404040',
      text: '#d8d8d8'
    },
    fonts: {
      main: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;`
    },
    sizes: {
    },
    fontSizes: {
      base: '16px'
    },
    radii: {
      normal: '0.25rem'
    },
    space: {
      normal: '0.75rem'
    }
  },
  conditions: {}
})

export const globalStyles = global({
  'html, body, #app': {
    height: '100%',
    fontFamily: '$main'
  },
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0
  }
})