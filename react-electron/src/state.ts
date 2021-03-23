import { useToast } from '@chakra-ui/toast'
import { MainContext } from '@src/preload'
import { atom, useAtom } from 'jotai'
import { useState } from 'react'
// import { ipcRenderer } from 'electron'

//@ts-ignore
const { core: coreContext, config: configContext, app: appContext }: MainContext = window.api

const init = {
  pid: atom(-1),
  app: atom(configContext.app()),
  panel: atom(configContext.panel()),
  editedPanel: atom(configContext.panel())
}

export const _app = () => {
  return {
    ...appContext
  }
}

export const _core = () => {
  const [pid, setPid] = useAtom(init.pid)
  return {
    isRunning: pid !== -1,
    pid,
    nullPid: () => setPid(-1),
    run: async () => {
      await setPid(coreContext.run())
    },
    close: () => {
      coreContext.kill(pid)
      setPid(-1)
    }
  }
}


export const _config = () => {
  const [app, setApp] = useAtom(init.app)
  const [panel, setPanel] = useAtom(init.panel)
  const [editedPanel, setEditedPanel] = useAtom(init.editedPanel)

  const [pid, setPid] = useAtom(init.pid)

  const restartCore = () => {
    if (pid != -1) {
      coreContext.kill(pid)
      setPid(coreContext.run())
    }
  }

  const refreshApp = async () => {
    console.log('refresh')
    setApp(await configContext.app())
  }
  const refreshPanel = async () => {
    setPanel(await configContext.panel())
    setEditedPanel(await configContext.panel())
  }

  return {
    app,
    panel,
    editedPanel,
    editor: {
      importUserShortcuts: async () => {
        const done = await configContext.updateAppShortcuts()
        if (done) {
          console.log('updated!')
          refreshApp()
        }
      },
      resetUserShortcuts: async () => {
        const done = await configContext.resetAppShortcuts()
        if (done) {
            refreshApp()
        }
      },
      panel: {
        hasChanges: JSON.stringify(editedPanel.keys) != JSON.stringify(panel.keys),
        updateKeys: (key: PanelKey) => {
          const index = editedPanel.keys.findIndex(k => k.id === key.id)
          if (index !== -1) {
            const updatedPanel = clone(editedPanel)
            updatedPanel.keys[index] = key
            setEditedPanel(updatedPanel)
          }
        },
        saveChanges: async () => {
          restartCore()
          // Always Run / On saving changes -> Restart
          const currentPanelConfig = clone(editedPanel)
          const keys = clone(editedPanel.keys)
          const newPanelConfig: PanelConfig = {
            ...currentPanelConfig,
            keys
          }
          await configContext.writePanelConfig(newPanelConfig)
          refreshPanel()
        },
        exportPanelConfig: async () => {
          const done = await configContext.exportPanelConfig()
          console.log(done ? 'export finished' : 'export canceled')
        },
        importPanelConfig: async () => {
          const done = await configContext.importPanelConfig()
          refreshPanel()
          console.log(done ? 'import finished' : 'import canceled')
        },
        cancelChanges: async () => {
          const edit = clone(panel)
          edit.keys = []
          await setEditedPanel(edit)
          setEditedPanel(panel)
        }
      }
    }
  }
}

export const clone = <T>(object:T):T => {
    return JSON.parse(JSON.stringify(object))
}