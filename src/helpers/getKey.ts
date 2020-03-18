import { AppConfig, Key } from "../store"
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
    if (instance.name === 'FN') return instance
    // return instance
    // formatted = JSON.parse(JSON.stringify(instance))
    // name = instance.name
    if (direction === 64) {
      formatted.name = instance.name
      formatted.value = instance.value
    } else {
      formatted.name = `${instance.name} ${direction === 1 ? '+' : '-'}`
      formatted.value = instance.value[direction === 1 ? 1 : 0]
      console.log(instance.value)
    }
    return formatted
  }
  return {} as Key

}

export default getKey