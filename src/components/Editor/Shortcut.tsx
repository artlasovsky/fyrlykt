import React, { useContext } from 'react'
import StoreContext from '../../store'
// import { Key } from '../../store'

interface Shortcut {
  
}

const Shortcut = ({ activeKey, category: [ category, setCategory ], title: [ title, setTitle] }:any) => {
  const { setters: { saveActiveKey }} = useContext(StoreContext)
  
  const sameShortcut = () => {
    if (category !== '—' && title !== '—') {
      return activeKey.category === category && activeKey.title === title
    } else {
      return true
    }
  }
  const sameShortcutShow = () => {
    return !sameShortcut() ? 'show' : ''
  }
  const revertSelection = () => {
    console.log(title)
    console.log(activeKey.title)
    if (activeKey.title && activeKey.category) {
      setTitle(activeKey.title)
      setCategory(activeKey.category)
    } else {
      setTitle('')
      setCategory('')
    }
  }
  
  return (
    activeKey.name ?
    <div className="shortcut">
      <p className={`activeKey ${sameShortcut() ? 'current' : ''} ${activeKey.title && activeKey.category ? 'defined' : ''}`}>
        { activeKey.title && activeKey.category ? `${activeKey.title} - ${activeKey.category}` : 'not defined' }
      </p>
      {title && category && <p className={`setter ${sameShortcutShow()}`}>New: {title} - {category}</p>}
      <div className={`buttons ${sameShortcutShow()}`}>
        <button onClick={() => saveActiveKey(activeKey, category, title)}>Save</button>
        <button onClick={revertSelection}>Cancel</button>
      </div>
    </div>
    :
    <div className="shortcut">
      <p>Shortcut info</p>
    </div>
  )
}

export default Shortcut