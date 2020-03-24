import { createContext, useState } from 'react'
import { WebMidi, Input } from 'webmidi'
import fs from 'fs'
import { remote } from 'electron'
import { join } from 'path'
import isDev from 'electron-is-dev'
import { getKey } from '../helpers/key'

const StoreContext = createContext({} as ReturnType<typeof Store>)

export default StoreContext

export const Store = () => {
  const [webMidi, _setWebMidi]:[WebMidi, Function] = useState({} as WebMidi)
  const [device, _setDevice]:[Input, Function] = useState({} as Input)
  const [config, _setConfig]:[AppConfig, Function] = useState({} as AppConfig)
  const [editMode, _setEditMode]:[boolean, Function] = useState(true)
  const [activeKey, _setActiveKey]:[Key, Function] = useState({} as Key)
  // const [currentKey, _setCurrentKey]:[CurrentKey, Function] = useState({} as CurrentKey)
  const userConfigPath = isDev ? './user' : remote.app.getAppPath().replace('app.asar', '')

  const setters = {
    loadConfig() {
      const userConfig = join(userConfigPath, `loupedeck.json`)
      let configPath = remote.app.isPackaged ? 
        join(remote.app.getAppPath(), './assets/loupedeck.config.json')
        : 
        './assets/loupedeck.config.json'
      let shortcutsPath = remote.app.isPackaged ?
        join(remote.app.getAppPath(), './assets/resolve.shortcut.json')
        :
        './assets/resolve.shortcut.json'
      const shortcuts = JSON.parse(fs.readFileSync(shortcutsPath, 'utf-8'))

      if (fs.existsSync(userConfig)) configPath = userConfig
      const panel = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      console.log(fs.existsSync(userConfig) ? 'user config loaded' : 'default config loaded')
      _setConfig({...panel, ...shortcuts})
    },
    resetConfig() {
      const userConfig = join(userConfigPath, 'loupedeck.json')
      fs.unlinkSync(userConfig)
      setters.loadConfig()
      setters.setActiveKey({} as Key)
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
    setActiveKey(key:Key) {
      if (key.name !== 'FN') _setActiveKey(key)
    },
    resetActiveKey() {
      _setActiveKey({})
    },
    toggleEditMode() {
      _setEditMode(!editMode)
      setters.resetActiveKey()
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
      const newConfig:AppConfig = JSON.parse(JSON.stringify(config))
      newConfig[keyType][keyId] = newKey
      _setConfig(newConfig)
      _setActiveKey(getKey(newConfig, [ activeKey.id, activeKey.direction ] as [number, number], fn).instance)
      if (!fs.existsSync(userConfigPath)) fs.mkdirSync(userConfigPath)
      const configFileName = `${newConfig.panel.toLowerCase()}`
      const configWithoutShortcuts = JSON.parse(JSON.stringify(newConfig))
      delete configWithoutShortcuts.app
      delete configWithoutShortcuts.shortcuts
      // console.log(configWithoutShortcuts)
      fs.writeFileSync(join(userConfigPath, `${configFileName}.json`), JSON.stringify(configWithoutShortcuts))
    }
  }
  const getters = {
    get userConfig() {
      return fs.existsSync(join(userConfigPath, 'loupedeck.json'))
    }
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
  direction: number,
  activeFn: boolean
}
export interface CurrentKey {
  title: string,
  category: string
}

export interface Shortcut {
  category: string,
  title: string,
  value: string
}

export interface AppConfig {
  app: string,
  panel: string,
  keys: Array<Key>, 
  knobs: Array<Key>, 
  shortcuts: Array<Shortcut>
  // [key: string]: Array<Key | Shortcut> | string 
}

export interface State {
  WebMidi: WebMidi,
  device: Input,
  Screen: string,
  config: AppConfig
}
export type Store = ReturnType<typeof Store>