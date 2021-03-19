import { createCss } from '@stitches/react'

const theme = {
  colors: {
    gray50: '#FAFAFA',
    gray100: '#F4F4F5',
    gray200: '#E4E4E7',
    gray300: '#D4D4D8',
    gray400: '#A1A1AA',
    gray500: '#71717A',
    gray600: '#52525B',
    gray700: '#3F3F46',
    gray800: '#27272A',
    gray900: '#18181B',
    yellow300: '#FCD34D',
    //
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
    xs: '0.25rem',
    sm: '0.5rem',
    normal: '0.75rem',
    md: '1rem',
    xl: '1.25rem'
  }
}

export const { styled, global } = createCss({
  theme,
  conditions: {
    dark: '@media (prefers-color-scheme: dark)',
    light: '@media (prefers-color-scheme: light)'
  },
  utils: {
    mx: () => (value: keyof typeof theme['space'] | (string & {})) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: () => (value: keyof typeof theme['space'] | (string & {})) => ({
      marginTop: value,
      marginBottom: value,
    }),
    px: () => (value: keyof typeof theme['space'] | (string & {})) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: () => (value: keyof typeof theme['space'] | (string & {})) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    size: () => (value: keyof typeof theme['sizes'] | (string & {})) => ({
      width: value,
      height: value
    }),
    borderLeftRadius: () => (value: keyof typeof theme['radii'] | (string & {})) => ({
      borderTopLeftRadius: value,
      borderBottomLeftRadius: value
    }),
    borderRightRadius: () => (value: keyof typeof theme['radii'] | (string & {})) => ({
      borderTopRightRadius: value,
      borderBottomRightRadius: value
    }),
    borderTopRadius: () => (value: keyof typeof theme['radii'] | (string & {})) => ({
      borderTopLeftRadius: value,
      borderTopRightRadius: value
    }),
    borderBottomRadius: () => (value: keyof typeof theme['radii'] | (string & {})) => ({
      borderBottomLeftRadius: value,
      borderBottomRightRadius: value
    }),
    scrollbar: () => (value: 'normal') => {
      return {
        '&::-webkit-scrollbar': {
          width: 4,
          height: 5
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'gray',
          opacity: 1
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'white',
          borderRadius: 5,
          opacity: 1,
          '&:hover': {
            opacity: 1,
            backgroundColor: 'gray'
          }
        },
        '&:hover': {
          '&::-webkit-scrollbar-thumb': {
            opacity: 1,
            backgroundColor: 'white'
          }
        }
      }
    },
  }
})

export const globalStyles = global({
  'html, body, #app': {
    height: '100%',
    fontFamily: '$main',
    backgroundColor: '$gray800',
    fontSize: '14px'
  },
  'button': {
    fontFamily: '$main'
  },
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0
  },
  'p, span': {
    userSelect: 'none'
  }
})