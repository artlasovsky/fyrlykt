import { _config, _core } from '@src/state'
import { styled } from '@src/stitches.config'
import React from 'react'
import { _Divider } from './Elements'

const _TopPane = {
  Root: styled('div', {
    fontSize: '1rem',
    display: 'flex',
    height: '4rem',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '$gray900',
    borderBottom: '1px solid $gray700',
    padding: '$md',
    justifyContent: 'space-between'
  }),
  Logo: styled('div', {

  }),
  Help: styled('div', {
    display: 'flex'
  }),
  ItemWithLabel: styled('div', {
    display: 'flex',
    flexDirection: 'column',
    px: '$sm',
    label: {
      fontSize: '0.7rem',
      opacity: 0.7
    }
  }),
  Config: styled('div', {
    display: 'flex'
  })
}

const Button = styled('button', {
  border: '1px solid $gray300',
  px: '$md',
  py: '$sm',
  fontSize: '0.7rem',
  borderRadius: '$normal',
  backgroundColor: '$gray100',
  fontWeight: '500',
  paddingBottom: '0.58rem',
  color: '$gray900',
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: '$gray300'
  },
  '&:disabled': {
    cursor: 'not-allowed',
    color: '$gray400',
    backgroundColor: '$gray200'
  }
})
const ButtonGroup = styled('div', {
  display: 'flex',
  variants: {
    direction: {
      horizontal: {
        mx: '$xs',
        '> *:not(:first-child)': {
          borderLeftRadius: '0',
          borderLeftWidth: 0
        },
        '> *:not(:last-child)': {
          borderRightRadius: '0'
        }
      },
      vertical: {}
    }
  },
  defaultVariants: {
    direction: 'horizontal'
  }
})

const _Spacer = styled('div', {
  flex: 1
})

export const TopPane = () => {
  const { panel, app, editor } = _config()
  const { pid, run, close } = _core()
  return <_TopPane.Root>
    <_TopPane.Logo>
      <p>Fyrlykt</p>
    </_TopPane.Logo>
    <_Spacer />
    <_Divider orientation='vertical'/>
    <_TopPane.Config>
      <_TopPane.ItemWithLabel>
        <label>Panel</label>
        <p>{panel.name}</p>
      </_TopPane.ItemWithLabel>
      <_TopPane.ItemWithLabel>
        <label>App</label>
        <p>{app.displayName}</p>
      </_TopPane.ItemWithLabel>
      <_TopPane.ItemWithLabel>
        <label>Shortcuts</label>
        <p>{!app.byUser ? 'Default' : 'User'}</p>
      </_TopPane.ItemWithLabel>
    </_TopPane.Config>
    <_Divider orientation='vertical'/>
    <_TopPane.Help>
      <_TopPane.ItemWithLabel>
        <label>Version</label>
        <p>0.2.0</p>
        {/* Update Notification is Here */}
      </_TopPane.ItemWithLabel>
      <p>donation</p>
      <p>help</p>
    </_TopPane.Help>
    <_Divider orientation='vertical'/>
    <ButtonGroup>
      <Button onClick={editor.importUserShortcuts}>Import Shortcuts</Button>
      {app.byUser && <Button onClick={editor.resetUserShortcuts}>Reset Shortcuts</Button>}
    </ButtonGroup>
    {/* <ButtonGroup>
      <Button disabled>Import Mappings</Button>
      <Button disabled>Export Mappings</Button>
    </ButtonGroup> */}
    {editor.panel.hasChanges && 
      <ButtonGroup>
        <Button onClick={editor.panel.saveChanges}>Save Changes</Button>
        <Button onClick={editor.panel.cancelChanges}>Cancel Changes</Button>
      </ButtonGroup>
    }
    <ButtonGroup>
      <Button disabled={pid != -1} onClick={run}>Run</Button>
      <Button disabled={pid == -1} onClick={close}>Stop</Button>
    </ButtonGroup>
  </_TopPane.Root>
}