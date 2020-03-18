import { createContext, useState } from 'react'
import { WebMidi, Input } from 'webmidi'
import fs from 'fs'
import { remote } from 'electron'
import { join } from 'path'

const StoreContext = createContext({} as ReturnType<typeof Store>)

export default StoreContext

export const Store = () => {
  const [webMidi, _setWebMidi]:[WebMidi, Function] = useState({} as WebMidi)
  const [device, _setDevice]:[Input, Function] = useState({} as Input)
  const [config, _setConfig]:[AppConfig, Function] = useState({} as AppConfig)

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
    }
  }
  const getters = {

  }
  return { 
    webMidi, device, 
    config, 
    setters, getters
  } as { 
    webMidi: typeof webMidi, device: typeof device,
    config: typeof config, 
    setters: typeof setters, getters: typeof getters
  }
}

export interface Key {
  id: number,
  name: string,
  value: string,
  fn: string,
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