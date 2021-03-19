import { _config } from '@src/state'
import { styled } from '@src/stitches.config'
import React, { useEffect, useState } from 'react'
import { _Divider, _Text } from './Elements'
import { ShortcutSelect } from './Select'

const _PanelKeyList = styled('div', {
  overflow: 'hidden',
  overflowY: 'auto',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  scrollbar: 'normal'
})

const _PanelKey = {
  Root: styled('div', {
    display: 'flex',
    borderTop: '1px solid gray',
    py: '$normal'
  }),
  Title: styled(_Text, {
    flex: '0 0 6rem'
  })
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

  const { shortcuts } = _config().app

  const { keys } = _config().editedPanel
  const { updateKeys } = _config().editor.panel

  useEffect(() => {
    const updatedKey = JSON.parse(JSON.stringify(keys.find(k => k.id == panelKey.id)))
    updatedKey[fn ? 'fn' : 'value'][id] = currentValue
    updateKeys(updatedKey)
  }, [currentValue])

  const currentValueInList = currentValue.length ? shortcuts.map(s => [s.category, s.name].join(' > ')).includes(currentValue) : true

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
    <p>{currentValueInList ? '' : 'not valid in current config [will not run due do not have shortcut]'}</p>
    <ShortcutSelect value={currentValue} setValue={setCurrentValue} shortcuts={shortcuts}/>
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


const PanelKeys = ({ keys }: { keys: PanelKey[] }) => {
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
  
  const filtered = keys.filter(key => keyGroups[selectedGroup].includes(key.name))

  return <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex' }}>
      {Object.keys(keyGroups).map(k => <p onClick={() => setSelectedGroup(k)} key={k}>{k}</p>)}
    </div>
    {filtered.map(key => 
      <PanelKey key={key.id} panelKey={key}/>
    )}
  </div>
}

export const PanelKeyList = () => {
  const panel = _config().editedPanel
  return <_PanelKeyList>
    <p>{panel.name}</p>
    <PanelKeys keys={panel.keys} />
  </_PanelKeyList>
}