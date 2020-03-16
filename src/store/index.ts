import { createContext, useState } from 'react'
import { WebMidi, Input } from 'webmidi'

const StoreContext = createContext({})

export default StoreContext

export const Store = (initialState:any) => {
  const [state, setState] = useState({...initialState})

  const setters = {
    setWebMidi(WebMidi: WebMidi) {
      setState({...state, ...{ WebMidi }})
    },
    setInput(MidiInput: Input | string) {
      setState({...state, ...{ MidiInput }})
    }
  }
  const getters = {
    getInput() {
      return state.MidiInput
    }
  }
  return { 
    state, setters, getters, setState 
  } as { 
    state: State, setters: typeof setters,
    getters: typeof getters, setState: typeof setState
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
  MidiInput: Input | string,
  Screen: string,
  config: AppConfig
}
export type Store = ReturnType<typeof Store>