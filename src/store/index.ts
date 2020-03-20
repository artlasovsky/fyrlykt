import { createContext, useState } from 'react'
import { WebMidi, Input } from 'webmidi'
import fs from 'fs'
import { remote } from 'electron'
import { join } from 'path'
import isDev from 'electron-is-dev'

const StoreContext = createContext({} as ReturnType<typeof Store>)

export default StoreContext

export const Store = () => {
  const [webMidi, _setWebMidi]:[WebMidi, Function] = useState({} as WebMidi)
  const [device, _setDevice]:[Input, Function] = useState({} as Input)
  const [config, _setConfig]:[AppConfig, Function] = useState({} as AppConfig)
  const [editMode, _setEditMode]:[boolean, Function] = useState(true)
  const [activeKey, _setActiveKey]:[Key, Function] = useState({} as Key)
  const userConfigPath = isDev ? './user' : remote.app.getAppPath().replace('app.asar', '')

  const setters = {
    loadConfig() {
      const configPath = remote.app.isPackaged ? 
        join(process.resourcesPath, './assets/loupedeck.json')
        : 
        './assets/loupedeck.json' 
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      console.log('load config')
      _setConfig(config)
    },
    setConfig(config:AppConfig) {
      _setConfig(config)
    },
    setWebMidi(WebMidi: WebMidi) {
      console.log('midi')
      _setWebMidi(WebMidi)
    },
    setDevice(name:string) {
      if (webMidi.inputs) {
        const input = webMidi.inputs.find(input => input.name === name)
        let device
        if (input) device = webMidi.getInputById(input.id)
        console.log('set device')
        _setDevice(device)
      }
    },
    toggleEditMode() {
      _setEditMode(!editMode)
    },
    setActiveKey(key:Key) {
      if (key.name !== 'FN') _setActiveKey(key)
    },
    saveActiveKey(activeKey:Key, category: string, title: string) {
      const keyType = activeKey.direction === 64 ? 'keys' : 'knobs'
      let directionIndex = null
      if (activeKey.direction === 127) directionIndex = 0
      else if (activeKey.direction === 1) directionIndex = 1
      const keyList:Array<Key> = JSON.parse(JSON.stringify(config[keyType]))
      const keyId = keyList.map(key => key.id).indexOf(activeKey.id)
      
      const currentKey = keyList[keyId]
      const fn = activeKey.activeFn
      const newValue = `\${${category} > ${title}}$`
      let value: string | string[]
      if (directionIndex !== null) {
        value = currentKey[fn ? 'fn' : 'value']
        if (typeof(value) === 'object') {
          value[directionIndex] = newValue
        }
      } else {
        value = newValue
      }
      const newKey = {
        ...currentKey, 
        ...{
          [fn ? 'fn' : 'value']: value
        }
      }
      console.log(newKey)
      // attach newKey to newConfig and save it
      // update config state
    }
  }
  const getters = {

  }
  return { 
    webMidi, device, 
    config, userConfigPath,
    editMode, activeKey,
    setters, getters
  } as { 
    webMidi: typeof webMidi, device: typeof device,
    config: typeof config, userConfigPath: typeof userConfigPath,
    editMode: typeof editMode, activeKey: typeof activeKey, 
    setters: typeof setters, getters: typeof getters
  }
}

export interface Key {
  id: number,
  name: string,
  value: string | string[],
  fn: string | string[],
  title?: string,
  category?: string,
  direction?: number,
  activeFn: boolean
}

export interface Shortcut {
  category: string,
  title: string,
  value: string
}

export interface AppConfig {
  keys: Array<Key>, 
  knobs: Array<Key>, 
  shortcuts: Array<Shortcut>,
  [key: string]: Array<Key | Shortcut> 
}

export interface State {
  WebMidi: WebMidi,
  device: Input,
  Screen: string,
  config: AppConfig
}
export type Store = ReturnType<typeof Store>