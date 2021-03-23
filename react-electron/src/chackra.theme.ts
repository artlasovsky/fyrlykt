import { extendTheme } from "@chakra-ui/react"

export const theme = extendTheme({
  styles: {
    global: (props) => ({
      'html': {
        height: '100vh',
      },
      'body': {
        overflow: 'hidden',
        height: '100%',
        fontSize: 'sm'
      },
      '#app': {
        height: '100%'
      },
      '.chakra-stack': {
        '&::-webkit-scrollbar': {
          width: '0.35rem',
          height: '0.35rem'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
          opacity: 1
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'gray.200',
        },
        '&:hover': {
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'gray.100'
          },
          '&::-webkit-scrollbar-thumb': {
            opacity: 1,
            backgroundColor: 'gray.400',
            '&:hover': {
              backgroundColor: 'gray.600'
            }
          }
        }
      }
    })
  }
})