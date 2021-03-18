import { MainContext } from '@src/preload'
import { proxy } from 'valtio'

//@ts-ignore
const { core, config: contextConfig }: MainContext = window.api

export const coreState = proxy({
  pid: -1,
  run: () => {
    coreState.pid = core.run()
  },
  kill: () => {
    core.kill(coreState.pid)
    coreState.pid = -1
  }
})

export const config = proxy({
  app: contextConfig.app(),
  panel: contextConfig.panel()
})


export const edited = proxy({
  app: {
    shortcuts: config.app.shortcuts
  },
  panel: {
    keys: config.panel.keys,
    updateKeys: (key: PanelKey) => {
      const index = edited.panel.keys.findIndex(k => k.id === key.id)
      if (index != -1) {
        const updatedKeys = JSON.parse(JSON.stringify(edited.panel.keys))
        updatedKeys[index] = key
        edited.panel.keys = updatedKeys
      }
    },
    saveChanges: async () => {
      // console.log('writing panel config')
      const currentPanelConfig = JSON.parse(JSON.stringify(config.panel))
      const keys = JSON.parse(JSON.stringify(edited.panel.keys))
      const newConfig:PanelConfig = {
        ...currentPanelConfig,
        keys
      }
      contextConfig.writePanelConfig(newConfig)

      config.panel = contextConfig.panel()
      edited.panel.keys = contextConfig.panel().keys
      // edited.app.shortcuts = config.app.shortcuts
      // console.log(edited.panel.keys)
      // console.log('append edited to panel config')
    },
    exportChanges: () => {},
    resetToDefaults: () => {},
    cancelChanges: () => {}
  }
})

export const changed = proxy({
  panelKeys: () => JSON.stringify(edited.panel.keys) !== JSON.stringify(config.panel.keys)
})