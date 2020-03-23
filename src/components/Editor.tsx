import React, { useContext, useState, useEffect } from 'react'
import StoreContext from '../store'
import Key from './Editor/Key'

const Editor = () => {
  const { activeKey, config: { shortcuts }, setters: { saveActiveKey } } = useContext(StoreContext)
  const [categories, setCategories]:[string[], Function] = useState([])
  const [titles, setTitles]:[string[], Function] = useState([])
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (shortcuts) {
      const _categories = shortcuts
        .map(shortcut => shortcut.category)
        .filter((x, i, a) => a.indexOf(x) === i)
      _categories.unshift('—')
      setCategories(_categories)
    }
  }, [shortcuts])
  useEffect(() => {
    if (shortcuts) {
      const _titles = shortcuts
        .filter(shortcut => shortcut.category === category)
        .map(shortcut => shortcut.title)
        .filter((x, i, a) => a.indexOf(x) === i)
      _titles.unshift('—')
      setTitles(_titles)
    }
    if (!category) setTitle('')
    // else if (!activeKey.category) setTitle(titles[0])
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
  
  const sameShortcut = () => {
    // if (activeKey.category !== '' && activeKey.title !== '') {
      return activeKey.category === category && activeKey.title === title
    // } else {
    //   return false
    // }
  }
  const revertSelection = () => {
    if (activeKey.title && activeKey.category) {
      setTitle(activeKey.title)
      setCategory(activeKey.category)
    }
  }

  return (
    <div id="editor">
      <div className="select">
        <Key activeKey={activeKey}/>
        <div className="shortcut">
          {
            activeKey.name ?
            <div className="info">
              {
                sameShortcut() ?
                <p>
                  { 
                    activeKey.title && activeKey.category ? 
                      `${category} - ${title}`
                      :
                      'empty'
                  }
                </p>
                :
                <div>
                  <p className="new">
                  { 
                    activeKey.title && activeKey.category ? 
                      `${category} - ${title}`
                      :
                      'not setted'
                  }
                  </p>
                  <p className="current">Current shortcut:{activeKey.category} - {activeKey.title}</p>
                  <button onClick={() => saveActiveKey(activeKey, category, title)}>Save</button>
                  <button onClick={revertSelection}>Cancel</button>
                </div>
              }
            </div>
            : 
            <div className="info">shortcut info</div>
          }
        </div>
      </div>
      <div className="config">
        <select className="category" value={category} size={15} onChange={(e) => setCategory(e.target.value)}>
          {categories?.map(category => <option value={category} key={category}>{category}</option>)}
        </select>
        <select className="shortcut" value={title} size={15} onChange={(e) => setTitle(e.target.value)}>
          {titles?.map(title => <option value={title} key={title}>{title}</option>)}
        </select>
      </div>
    </div>
  )
}

export default Editor