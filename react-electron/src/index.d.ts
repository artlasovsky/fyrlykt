declare module '*.css'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'



interface PanelConfig {
  name: string,
  keys: [Key]
}

interface Key {
  id: number,
  name: string,
  value: [string],
  fn: [string]
}

interface Shortcut {
  category: string,
  name: string,
  value: string
}

interface AppConfig {
  name: string,
  displayName: string,
  shortcuts: [Shortcut]
}