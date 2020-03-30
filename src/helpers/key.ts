import { AppConfig, Key, Shortcut } from "../types"
import { send } from './py'

export const getKey = (config: AppConfig, [ keyID, direction ]: Array<number>, FN: boolean):{ instance: Key | null, shortcut: Array<PySend> | null }  => {
  const list: Array<Key> = direction === 64 ? config.keys : config.knobs
  const instance: Key | undefined = list.find(key => key.id === keyID)
  let formatted = {} as Key
  if (instance) {
    if (instance.name === 'FN') return { instance, shortcut: null }
    if (direction === 64) {
      formatted.name = `${FN ? '[FN] ' : ''}${instance.name}`
      formatted.value = FN ? instance.fn : instance.value
    } else {
      formatted.name = `${FN ? '[FN] ' : ''}${instance.name} ${direction === 1 ? '+' : '-'}`
      formatted.value = instance.value[direction === 1 ? 1 : 0]
    }
    let category, title
    if (typeof(formatted.value) === 'string') {
      [ category, title ] = formatted.value.slice(2, -2).split(' > ')
    }
    formatted.title = title
    formatted.category = category
    formatted.direction = direction
    formatted.id = instance.id
    formatted.activeFn = FN
    const decodeShortcut = (shortcuts:Array<Shortcut>, category:string | undefined, title:string | undefined):Array<PySend> | null  => {
      const value = shortcuts.find(shortcut => shortcut.category === category && shortcut.title === title)?.value
      if (value) {
        const commands = value.split('~').map(command => {
          // Replacing ctrl/alt with command/option on macOS
          if (process.platform !== 'win32') command = command.replace('ctrl', 'command').replace('alt', 'option')
          // Splitting config string to different types of commands
          if (command.includes('[') && command.includes(']')) {
            return { command: 'press', params: [ command.slice(1, -1) ] }
          }
          if (command.includes('{') && command.includes('++') && command.includes('}')) {
            return { command: 'hotkey', params: command.slice(1, -1).split('++') }
          }
          if (command.includes('{') && command.includes('}')) {
            return { command: 'write', params: [ command.slice(1, -1) ] }
          }
          return undefined
        }).filter(command => command !== undefined)
        return commands as Array<PySend>
      } else return null
    }
    const shortcut = decodeShortcut(config.shortcuts, category, title)
    return { instance: formatted as Key, shortcut }
  }
  return { instance: null, shortcut: null }
}

export const runCommand = (key: { instance: Key | null, shortcut: PySend[] | null}, app: string) => {
  if (key.shortcut) {
    for(let command of key.shortcut) {
      send(JSON.stringify({...command, ...{ app }}))
    }
  }
}
export const pyStart = () => {
  send('start')
}

interface PySend {
  command: string,
  params: Array<string>
}