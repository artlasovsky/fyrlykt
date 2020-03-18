import { AppConfig, Key, Shortcut } from "../store"
import { InputEventNoteon, InputEventNoteoff, InputEventControlchange } from "webmidi"

type InputEvent = InputEventNoteon | InputEventNoteoff | InputEventControlchange 
const getKey = (config: AppConfig, inputEvent:InputEvent, FN: boolean) => {
  const keyID = inputEvent.data[1]
  const direction = inputEvent.data[2]
  const list: Array<Key> = direction === 64 ? config.keys : config.knobs
  const instance: Key | undefined = list.find(key => key.id === keyID)
  // console.log(instance)
  // let value:string = ''
  // let name:string = ''
  let formatted = {} as Key
  if (instance) {
    if (instance.name === 'FN') return { instance }
    // return instance
    // formatted = JSON.parse(JSON.stringify(instance))
    // name = instance.name
    // console.log(FN)
    if (direction === 64) {
      formatted.name = instance.name
      formatted.value = FN ? instance.fn : instance.value
    } else {
      formatted.name = `${instance.name} ${direction === 1 ? '+' : '-'}`
      formatted.value = instance.value[direction === 1 ? 1 : 0]
      // console.log(instance.value)
    }
    const [ category, title ] = formatted.value.slice(2, -2).split(' > ')
    const shortcuts: Array<Shortcut> = config.shortcuts
    const shortcut: string | undefined = shortcuts.find(shortcut => shortcut.category === category && shortcut.title === title)?.value
    // Continue to Decote to get it as [params] 
    return { instance: formatted as Key, shortcut }
  }
  return { instance: {}, shortcut: '' } as { instance: Key, shortcut: string | undefined }

}

export default getKey