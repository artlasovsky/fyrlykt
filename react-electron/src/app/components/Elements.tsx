import { styled } from '@src/stitches.config'

export const _Text = styled('p', {

})

export const _Button = styled('button', {
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

export const _ButtonGroup = styled('div', {
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

export const _Divider = styled('div', {
  variants: {
    orientation: {
      horizontal: {
        width: '100%',
        height: '1px',
        backgroundColor: 'gray',
        my: '$normal'
      },
      vertical: {
        width: '1px',
        height: '100%',
        backgroundColor: 'gray',
        mx: '$normal'
      }
    }
  }
})