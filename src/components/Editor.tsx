import React, { useContext, useState, useEffect } from 'react'
import StoreContext from '../store'

const Editor = () => {
  const { activeKey, config: { shortcuts }, userConfigPath, setters: { saveActiveKey } } = useContext(StoreContext)
  const [categories, setCategories]:[string[], Function] = useState([])
  const [titles, setTitles]:[string[], Function] = useState([])
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')

  // const saveShortcut = () => {
  //   // const userConfig = isDev ? './user' : remote.app.getAppPath().replace('app.asar', '')
  //   // console.log(fs.readdirSync(appPath))
  //   // fs.writeFileSync()
  //   console.log('save')
  // }
  // on load
  useEffect(() => {
    if (shortcuts) {
      const _categories = shortcuts
        .map(shortcut => shortcut.category)
        .filter((x, i, a) => a.indexOf(x) === i)
      setCategories(_categories)
    }
  }, [shortcuts])
  useEffect(() => {
    if (shortcuts) {
      setTitles(shortcuts
        .filter(shortcut => shortcut.category === category)
        .map(shortcut => shortcut.title)
        .filter((x, i, a) => a.indexOf(x) === i))
    }
    if (!category) setTitle('')
    // eslint-disable-next-line
  }, [category])
  
  useEffect(() => {
    categories.length && !category && setCategory(categories[0])  
    // eslint-disable-next-line
  }, [categories])
  useEffect(() => {
    titles.length && !title && setTitle(titles[0])
    // eslint-disable-next-line
  }, [titles])
  useEffect(() => {
    if (activeKey.category) {
      setCategory(activeKey.category)
      activeKey.title ? setTitle(activeKey.title) : setTitle('')
    } else {
      setCategory('')
      setTitle('')
    }
  }, [activeKey])

  return (
    <div id="editor">
      <p>Editor</p>
      {activeKey.name ? 
        <div>
          <p>{userConfigPath}</p>
          <p>{JSON.stringify(activeKey.name)}</p>
          {/* <p>{JSON.stringify(activeKey.id)}</p>
          <p>{JSON.stringify(
            config[activeKey.direction === 64 ? 'keys' : 'knobs']
            .filter(key => key.id === activeKey.id)
          )}</p> */}
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">—</option>
            {categories?.map(category => <option value={category} key={category}>{category}</option>)}
          </select>
          <select value={title} onChange={(e) => setTitle(e.target.value)}>
            <option value="">—</option>
            {titles?.map(title => <option value={title} key={title}>{title}</option>)}
          </select>
          <p>Current: {activeKey.category} - {activeKey.title}</p>
          <p>New: {category} - {title}</p>
          <button onClick={() => saveActiveKey(activeKey, category, title)}>Save</button>
        </div>
        :
        <p>Press key or knob on your Loupedeck or select from list</p>
      }
    </div>
  )
}

export default Editor