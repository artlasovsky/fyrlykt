import { MainContext } from '@src/preload'
import { proxy } from 'valtio'

//@ts-ignore
const { core, config }: MainContext = window.api

export const coreState = proxy({
  pid: 0,
  run: () => {
    coreState.pid = core.run()
  },
  kill: () => core.kill(coreState.pid)
})

export const configState = proxy({
  ...config
})