import React, { useContext, useState, useEffect } from 'react'
import StoreContext from '../store'
import Key from './Editor/Key'
import Shortcut from './Editor/Shortcut'
import List from './Editor/List'

const Editor = () => {
  const { activeKey, config: { shortcuts } } = useContext(StoreContext)
  const [categories, setCategories]:[string[], Function] = useState([])
  const [titles, setTitles]:[string[], Function] = useState([])
  const [category, setCategory] = useState('—')
  const [title, setTitle] = useState('—')

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
    if (!category) setTitle('—')
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
      activeKey.title ? setTitle(activeKey.title) : setTitle('—')
    } else {
      setCategory('—')
      setTitle('—')
    }
  }, [activeKey])

  const shortcutValue = (title:string) => {
    console.log(title)
    // shortcuts.find(shortcut => shortcut.category && shortcut.title === title)?.value
    const shortcut = shortcuts.find(shortcut => shortcut.title === title && shortcut.category === category)
    let value = <span></span>
    if (shortcut) value = <span className="shortcutValue">{shortcut.value.slice(1,-1).split('++').join(' + ').split(']~{').join(' , write ').split('}~[').join(' and ').toUpperCase()}</span>
    return value
  }

  return (
    <div id="editor">
      <div className="select">
        <Key activeKey={activeKey}/>
        <Shortcut activeKey={activeKey} category={[ category, setCategory ]} title={[ title, setTitle ]}/>
      </div>
      <div className="list">
        <List className="categories">
          {categories?.map(_category => 
            <p className={`category ${_category === category ? 'active' : ''}`} 
            onClick={() => setCategory(_category)} 
            key={_category}>
              {_category}
            </p>
          )}
        </List>
        <List className="titles">
          {titles?.map(_title => 
            _title.includes('{') && _title.includes('}') ?
            <p className="title splitter" key={_title}>──────</p>
            :
            <div className={`title ${_title === title ? 'active' : ''}`} 
            onClick={() => setTitle(_title)}
            key={_title}>
              <p className="name">
                {_title}<br/>{shortcutValue(_title)}
              </p>
              { _title !== '—' && <div className="controls">
                {/* <button>edit</button> */}
              </div>}
            </div>
          )}
        </List>
      </div>
    </div>
  )
}

export default Editor