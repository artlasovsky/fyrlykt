import { config, coreState, edited } from '@src/state'
import { styled } from '@src/stitches.config'
import logo from '@static/logo.png'
import React, { BaseSyntheticEvent, SyntheticEvent, useEffect, useState } from 'react'
import { hot } from 'react-hot-loader'
import { subscribe, useSnapshot } from 'valtio'
import { _Button, _ButtonGroup, _Divider } from './Elements'

import Select from 'react-select'


const ShortcutSelect = ({ value, setValue }: { value: string, setValue: (e: string) => void}) => {

  const { shortcuts } = useSnapshot(config.app)
  const shortcutList: { label: string, options: { value: string, label: string}[] }[] = []

  for (let shortcut of shortcuts) {
    const categoryId = shortcutList.findIndex(s => s.label === shortcut.category)
    
    const formattedShortcut = {
      value: [shortcut.category, shortcut.name].join(' > '),
      label: shortcut.name
    }
    if (categoryId >= 0) {
      shortcutList[categoryId].options.push(formattedShortcut)
    } else {
      shortcutList.push({
        label: shortcut.category,
        options: [ formattedShortcut ]
      })
    }
  }
  
  const Group = styled('div', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  })
  const GroupBadge = styled('span', {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
  })
  
  const formatGroupLabel = (data:any) => (
    <Group>
      <span>{data.label}</span>
      <GroupBadge>{data.options.length}</GroupBadge>
    </Group>
  )
  const styles = {
    container: (styles:any) => ({ ...styles, width: '100%', outline: 'gray' }),
    option: (styles: any, state: any) => {
      return {
        ...styles, 
        color: 'gray', 
        ...state.isSelected ? {
          backgroundColor: 'lightgray'
        } : {
          backgroundColor: 'white'
        },
        ...state.isFocused ? {
          color: 'white',
          backgroundColor: 'lightgray'
        } : {}
      }
    },
    control: (styles:any) => {
      return { 
        ...styles, 
        borderColor: 'gray', 
        boxShadow: 'none', 
        '&:hover': { 
          borderColor: 'gray' 
        } }
    }
  }

  const onChange = (item:any) => {
    if (item === null) {
      setValue('')
    } else {
      setValue(item.value)
    }
  }

  const item = {
    value: value,
    label: value.split(' > ')[1]
  }

  return <Select isClearable onChange={onChange} styles={styles} defaultValue={item}
    options={shortcutList}
    formatGroupLabel={formatGroupLabel} />
}

const AppContainer = styled('div', {
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$normal',
  color: '$text'
})

const _PanelKeyList = styled('div', {
  overflow: 'hidden',
  overflowY: 'auto',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  scrollbar: 'normal'
})

const _Text = styled('p', {

})

const _PanelKey = {
  Root: styled('div', {
    display: 'flex',
    borderTop: '1px solid gray',
    py: '$normal'
  }),
  Title: styled(_Text, {
    flex: '0 0 6rem'
  }),

}

const _KeyValues = {
  Root: styled('div', {
    display: 'flex',
    width: '100%',
    px: '$sm',
    py: '$xs'
  }),
  Group: styled('div', {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  })
}

const KeyValue = ({ value, id, panelKey, fn = false }: { value: string, id: number, panelKey: PanelKey, fn?: boolean }) => {

  const [currentValue, setCurrentValue] = useState(value)

  const { updateKeys, keys } = useSnapshot(edited.panel)

  useEffect(() => {
    const updatedKey = JSON.parse(JSON.stringify(keys.find(k => k.id == panelKey.id)))
    updatedKey[fn ? 'fn' : 'value'][id] = currentValue
    // console.log(updatedKey)
    updateKeys(updatedKey)
  }, [currentValue])

  const prefix = fn ? 'Fn + ' : ''

  const keyType = (valueId: number) => {
    switch (valueId) {
      case 0: return [prefix, 'Click'].join(' ')
      case 1: return [prefix, 'Rotate Left'].join(' ')
      case 2: return [prefix, 'Rotate Right'].join(' ')
    }
  }
  return <div key={id}>
    <p>{keyType(id)}</p>
    <p>{currentValue}</p>
    <ShortcutSelect value={currentValue} setValue={setCurrentValue}/>
  </div>
}

const KeyValues = ({ panelKey }: { panelKey: PanelKey }) => {
  return <_KeyValues.Root>
    <_KeyValues.Group>
      {panelKey.value.map((value, id) => 
        <KeyValue key={id} value={value} id={id} panelKey={panelKey}/>
      )}
    </_KeyValues.Group>
    <_Divider orientation='vertical' />
    <_KeyValues.Group>
      {panelKey.fn.map((value, id) => 
        <KeyValue key={id} value={value} panelKey={panelKey} id={id} fn/>
      )}
    </_KeyValues.Group>
  </_KeyValues.Root>
}

const PanelKey = ({ panelKey }: { panelKey: PanelKey }) => {
  return <_PanelKey.Root>
    <_PanelKey.Title>{panelKey.name}
      <br/><span>[{panelKey.value.length === 1 ? 'Key' : 'Knob'}]</span>
    </_PanelKey.Title>
    <_Divider orientation='vertical' />
    <KeyValues panelKey={panelKey}/>
  </_PanelKey.Root>
}


const PanelKeyList = () => {
  const { panel } = useSnapshot(config)
  const { name: panelName, keys: panelKeys } = panel

  function range(start:number, end: number) {
    return [...Array(end - start + 1).keys()].map(i => i + start);
}
  

  const keyGroups = {
    Arrows: ['Left', 'Right', 'Up', 'Down'],
    System: ['Copy', 'Paste', 'Shift', 'Ctrl', 'Command', 'Alt', 'Tab', 'Hue', 'Sat', 'Lum', 'Custom Mode', 'Clr / BW', 'Before After', 'Screen Mode', 'Export'],
    PKeys: range(1, 8).map(i => `P${i}`),
    HueP: range(1, 8).map(i => `Hue P${i}`),
    SatP: range(1, 8).map(i => `Sat P${i}`),
    LumP: range(1, 8).map(i => `Lum P${i}`),
    LKeys: range(1, 3).map(i => `L${i}`),
    CKeys: range(1, 6).map(i => `C${i}`),
    Dials: ['Control Dial', 'D1', 'D2', 'Contrast', 'Clarity', 'Shadows', 'Hightlights', 'Blacks', 'Whites', 'Temperature', 'Tint', 'Vibrance', 'Saturation']
  } as {
    [key: string]: string[]
  }

  const [selectedGroup, setSelectedGroup] = useState('CKeys')

  
  const keys = panelKeys.filter(panelKey => keyGroups[selectedGroup].includes(panelKey.name)).map(panelKey => <PanelKey key={panelKey.id} panelKey={panelKey}/>)

  return <_PanelKeyList>
    <p>{panelName}</p>
    <div style={{ display: 'flex'}}>
      {Object.keys(keyGroups).map(k => <p onClick={() => setSelectedGroup(k)} key={k}>{k}</p>)}
    </div>
    {keys}
  </_PanelKeyList>
}

const App = () => {
  const core = useSnapshot(coreState)
  const { panel, app } = useSnapshot(config)
  const { keys: editedPanelKeys, saveChanges } = useSnapshot(edited.panel)
  const hasChanges = JSON.stringify(editedPanelKeys) !== JSON.stringify(config.panel.keys)

  return <AppContainer>
    {/* TOP */}
    <p onClick={saveChanges}>{panel.name} - {app.displayName} - {hasChanges ? 'changed' : 'not changed'}</p>
    {/* CONTENT */}
    <PanelKeyList />
    {/* BOTTOM */}
    <_ButtonGroup>
      {core.pid != -1 ? 
        <_Button onClick={core.kill}>Kill Core</_Button>
        :
        <_Button onClick={core.run}>Run Core</_Button>
      }
    </_ButtonGroup>
  </AppContainer>
}

export default hot(module)(App);
