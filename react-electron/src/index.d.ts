declare module '*.css'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'



interface PanelConfig {
  name: string,
  keys: PanelKey[]
}

interface PanelKey {
  id: number,
  name: string,
  value: string[],
  fn: string[]
}

interface Shortcut {
  category: string,
  name: string,
  value: string
}

interface AppConfig {
  name: string,
  byUser?: boolean,
  displayName: string,
  shortcuts: Shortcut[]
}