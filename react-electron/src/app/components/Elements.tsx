import { styled } from '@src/stitches.config'

export const Button = styled('button', {
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

export const ButtonGroup = styled('div', {
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