import { WebMidi, Input } from "webmidi"

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
  appDisplayName: string,
  panel: string,
  description: string,
  keys: Array<Key>, 
  knobs: Array<Key>, 
  shortcuts: Array<Shortcut>
}

export interface State {
  WebMidi: WebMidi,
  device: Input,
  Screen: string,
  config: AppConfig
}