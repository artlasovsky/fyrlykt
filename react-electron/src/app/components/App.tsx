import { clone, _config, _core } from '@src/state'
import logo from '@static/logo.png'
import React, { useEffect, useState } from 'react'
import { hot } from 'react-hot-loader'

import { Button, ButtonGroup, Container, Select, Divider, Menu, MenuItem, MenuDivider, MenuList, Heading, HStack, MenuButton, Spacer, Text, MenuGroup, Tag, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Input, Tabs, TabList, Tab, TabPanel, TabPanels, useToast, UseToastOptions } from "@chakra-ui/react"
import { VStack } from "@chakra-ui/react"
import { range } from '@app/lib'


const TopBar = () => {
  const { hasChanges, saveChanges, cancelChanges } = _config().editor.panel
  const { importUserShortcuts, resetUserShortcuts } = _config().editor
  const appConfig = _config().app
  const { run, close, isRunning: coreIsRunning, nullPid } = _core()

  const toast = useToast()
  const [message, setMessage] = useState(null as null | UseToastOptions)
  useEffect(() => {
    // console.log(message)
    // toast
    if (message !== null) {
      toast(message)
      setTimeout(() => {
        setMessage(null)
      }, 1200)
    }
  }, [message])


  window.onmessage = (event:any) => {
    const { id, message } = event.data
    if (id === 'pid') {
      if (message == -1) {
        nullPid()
      }
    }
    if (id === 'core') {
      setMessage(message)
    }
  }

  return <HStack p="4" shadow="lg" alignItems="center" height="16" spacing="4">
    <VStack align="flex-end" spacing="0.25">
      <Heading fontSize="lg">Fyrlykt</Heading>
      <Text fontSize="xs" opacity="0.5">v. 0.2.0</Text>
    </VStack>
    <Divider orientation="vertical" color="gray.300"/>
    <Spacer />
    {hasChanges && <ButtonGroup size='sm' isAttached>
      <Button colorScheme='yellow' onClick={saveChanges}>Save Changes</Button>
      <Button onClick={cancelChanges}>Cancel Changes</Button>
    </ButtonGroup>}
    <Menu>
      <MenuButton as={Button} size="sm">Help</MenuButton>
      <MenuButton as={Button} size="sm">Config</MenuButton>
      <MenuList>
        <MenuGroup title={["Resolve Config", appConfig.byUser ? '(Custom)' : null].join(' ')}>
          <MenuItem onClick={importUserShortcuts}>Import...</MenuItem>
          <MenuItem isDisabled={!appConfig.byUser} onClick={resetUserShortcuts}>Reset to Default</MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title="Loupedeck Config">
          <MenuItem>Import...</MenuItem>
          <MenuItem>Export...</MenuItem>
          <MenuItem isDisabled>Reset to Default</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
    <ButtonGroup colorScheme="orange" variant="solid" size="sm" isAttached>
      {coreIsRunning ?
        <Button onClick={close}>Stop</Button>
        :
        <Button onClick={run}>Run</Button>
      }
    </ButtonGroup>
    {/* <Button colorScheme="orange" size="sm">Update Available!</Button> */}
  </HStack>
}

const KeyTitle = ({ panelKey }: { panelKey: PanelKey }) => {
  const type = panelKey.value.length > 1 ? 'knob': 'key'
  return <VStack alignItems="flex-start" spacing="-0.5" maxW="48">
    <Heading fontSize="2xl" minW="36">{panelKey.name}</Heading>
    <Text fontSize="sm" opacity="0.5">{type}</Text>
  </VStack>
}



interface KeyActionProps {
  name: string,
  value: string,
  panelKey: PanelKey,
  setValue: (value: string) => void
}

const shortcutDisplayName = (value:string):string => {
  const checkList = {
    Session: 'Color',
    BaseMemoryAll: 'Reset Grades and Keep Notes',
    BaseMemory: 'Reset Selected Node Grade',
    BaseMemoryReset: 'Reset All Grades and Nodes'
  } as { [key: string]: string }
  const name = checkList[value.split(' ').join('')]
  return name || value
}

const commandsList = (commands: string[], selectedGroup: string) => {
  const groups = {
    // Session is Color
    Session: [
      { value: 'Nodes', display: 'Nodes' },
      { value: 'Printer Lights', display: 'Printer Lights' },
      { value: 'Memories', display: 'Memories' },
      { value: 'Base', display: 'Reset' },
      { value: 'Track', display: 'Tracker' },
      { value: 'Version', display: 'Version' },
    ],
    Edit: [
      { value: 'Multicam Cut', display: 'Multicam Cut'},
      { value: 'Multicam Switch', display: 'Multicam Switch'},
      { value: 'Multicam', display: 'Multicam'},
      { value: 'Track Lock', display: 'Track Lock'},
      { value: 'Auto Select', display: 'Auto Track Selector'},
    ]
  } as { [key: string]: { value: string, display: string }[]}
  
  const grouped = {} as { [key: string]: string[] }
  
  for (let group of groups[selectedGroup] || []) {
    for (let command of commands) {
      if (command.includes(group.value)) {
        if (!grouped[group.display]) {
          grouped[group.display] = []
        }
        if (!grouped[group.display].includes(command) && !Object.values(grouped).flat().includes(command)) {
          grouped[group.display].push(command)
        }
      }
    }
  }
  const other = commands.filter(command => !Object.values(grouped).flat().includes(command))

  return <>
    {Object.entries(grouped).map(([key, values]) => 
      <optgroup label={key} key={key}>
        {values.sort().map(value => 
          <option key={value+key} value={value}>{shortcutDisplayName(value).replace(key, '')}</option>  
        )}
      </optgroup>
    ) }
    {other.map(value => 
      <option key={value} value={value}>{shortcutDisplayName(value)}</option>  
    )}
  </>
}

const KeyAction = ({ name, value, panelKey, setValue }:KeyActionProps ) => {
  const [newValue, setNewValue] = useState(value)
  const [group, setGroup] = useState(newValue.split(' > ')[0] || '')
  const [command, setCommand] = useState(newValue.split(' > ')[1] || '')


  const [displayNewValue, setDisplayNewValue] = useState(value)

  useEffect(() => {
    if (group && command) {
      setNewValue([group, command].join(' > '))
      setDisplayNewValue([group, shortcutDisplayName(command)].join(' > '))
    } else {
      setNewValue('')
    }
  }, [command])

  useEffect(() => {
    setCommand('')
  }, [group])

  const isChanged = value !== newValue
  
  const saveChanges = () => {
    setValue(newValue)
  }


  const resetChanges = () => {
    setNewValue(value)
  }

  const setEmpty = () => {
    setNewValue('')
    setGroup('')
    setCommand('')
  }

  const shortcuts = _config().app.shortcuts

  function onlyUnique(value:any, index:any, self:any) {
    return self.indexOf(value) === index;
  }
  
  const groups = shortcuts.map(s => s.category).filter(onlyUnique)
  const commands = shortcuts.filter(s => s.category === group).map(s => s.name)

  // console.log(commands)

  return <Popover>
    <PopoverTrigger>
      <VStack alignItems="flex-start">
        <Tag variant='outline' size="sm">{name}</Tag>
        <ButtonGroup isAttached size="sm">
          {value.length > 0 ? 
            <Button>{value}</Button>
            :
            <Button>Empty</Button>
          }
          {/* 0.3.0 CHAINING: */}
          {/* <Button>+</Button> */}
        </ButtonGroup>
      </VStack>
    </PopoverTrigger>
    <PopoverContent minW="500px">
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Assing Command to <Tag size="sm" variant="outline" >{panelKey.name}</Tag></PopoverHeader>
      <PopoverBody>
        <VStack alignItems="flex-start">
          <Tag variant="outline" size="sm">{name}</Tag>
          <Tag>{value}</Tag>
          <HStack width="100%">
            <VStack spacing='0' flex="1">
              <Select placeholder='— empty group —' value={group} onChange={e => setGroup(e.target.value)}>
                {groups.map(group => <option key={group} value={group}>{shortcutDisplayName(group)}</option>)}
              </Select>
            </VStack>
            <VStack spacing='0' flex="2">
              {/* <Input placeholder='Empty Filter' size='xs' value={commandFilter} onChange={e => setCommandFilter(e.target.value)} /> */}
              <Select isDisabled={group.length === 0} placeholder='— empty command —' value={command} onChange={e => setCommand(e.target.value)}>
                {commandsList(commands, group)}
              </Select>
            </VStack>
          </HStack>
          <Tag>{displayNewValue}</Tag>
          <ButtonGroup size="sm" width="full">
            <Button isDisabled={!isChanged} onClick={saveChanges} colorScheme="green" flex="3">Save</Button>
            <Button isDisabled={!isChanged} onClick={resetChanges} flex="1">Reset Changes</Button>
            <Button isDisabled={newValue.length === 0}onClick={setEmpty} flex="1">Set Empty</Button>
          </ButtonGroup>
        </VStack>
      </PopoverBody>
    </PopoverContent>
  </Popover>
}

const Editor = ({ keys }: { keys: PanelKey[]}) => {
  const direction = (index:number) => {
    switch (index) {
      case 0: return 'Click'
      case 1: return 'Rotate Left'
      case 2: return 'Rotate Right'
    }
  }

  const updateKeys  = _config().editor.panel.updateKeys

  const saveValue = (key: PanelKey, valueIndex: number, value: string, fn:boolean = false) => {
    const newKey = clone(key)
    newKey[fn ? 'fn' : 'value'][valueIndex] = value
    // console.log(newKey)
    updateKeys(newKey)
  }

  return <VStack overflowY="auto" height="full" px="0" paddingRight="2">
    {keys.map(key => 
      <HStack key={key.name} width="full" py="4" px="4" borderRadius="base" border="1px solid transparent" _hover={{ border: '1px solid var(--chakra-colors-gray-200)' }}>
        <KeyTitle panelKey={key}/>
        <HStack px="4" justifyContent="space-between" width="100%">
            {key.value.map((value, valueIndex) => 
              <HStack key={valueIndex} spacing="8" minW="30%">
                <Divider height="20" orientation="vertical"/>
                <VStack alignItems="flex-start">
                  <KeyAction name={direction(valueIndex)} value={value} panelKey={key} setValue={v => saveValue(key, valueIndex, v)} />
                  <KeyAction name={['Fn', direction(valueIndex)].join(' + ')} value={key.fn[valueIndex]} panelKey={key} setValue={v => saveValue(key, valueIndex, v, true)}/>
                </VStack>
              </HStack>
            )}
        </HStack>
        <Spacer />
      </HStack>  
    )}
  </VStack>
}

const EditorFiltered = () => {
  const keys = _config().editedPanel.keys
  const [tabIndex, setTabIndex] = useState(0)
  
  const keyGroups = {
    'System': ['Copy', 'Paste', 'Shift', 'Ctrl', 'Command', 'Alt', 'Tab', 'Left', 'Right', 'Up', 'Down'],
    'Dials': ['Control Dial', 'D1', 'D2', 'Contrast', 'Clarity', 'Shadows', 'Hightlights', 'Blacks', 'Whites', 'Temperature', 'Tint', 'Vibrance', 'Saturation'],
    'C1 - C8': range(1, 6).map(i => `C${i}`),
    'L1 - L3': range(1, 3).map(i => `L${i}`),
    'P1 - P8': range(1, 8).map(i => `P${i}`),
    'Hue Dials': range(1, 8).map(i => `Hue P${i}`),
    'Sat Dials': range(1, 8).map(i => `Sat P${i}`),
    'Lum Dials': range(1, 8).map(i => `Lum P${i}`),
    'Other': ['Custom Mode', 'Clr / BW', 'Before After', 'Screen Mode', 'Export'],
  } as {
    [key: string]: string[]
  }

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  const keyGroupNames = Object.keys(keyGroups)
  
  const filtered = (groupName: string) => keys.filter(key => keyGroups[groupName].includes(key.name))
  return <Tabs isLazy index={tabIndex} onChange={handleTabsChange} display="flex" flexDirection="column" overflow='hidden'>
    <TabList>
      {keyGroupNames.map(group => 
        <Tab key={group} _focus={{ outline: 'none' }}>{group}</Tab>
      )}
    </TabList>
    <TabPanels display="flex" flexDirection="column" overflow="hidden">
      {keyGroupNames.map(group => 
        <TabPanel key={group} p='2' overflowY="auto" overflowX="hidden">
          <Editor keys={filtered(group)}/>
        </TabPanel>
      )}
    </TabPanels>
  </Tabs>
}

const App = () => {

  const { app, editor } = _config()
  return <Container px="0" maxW="container.xl" color="gray.600" backgroundColor="gray.50" height="full" display="flex" flexDirection="column">
    <TopBar />
    <Divider />
    <EditorFiltered />
  </Container>
}

export default hot(module)(App);
