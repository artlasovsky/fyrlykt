import React, { FC, useState, useEffect } from 'react'
import './List.scss'


const List:FC<{className: string}> = ({ children, className } ) => {
  const [element, setElement] = useState({ clientHeight: -1 } as Element)
  const [thumbHeight, setThumbHeight]:[number, Function] = useState(-1)
  const [thumbStyle, setThumbStyle] = useState({ top: 0 } as { height: number | string, top: number })
  const [scrollBar, setScrollBar] = useState('')

  useEffect(() => {
    if (element.clientHeight === -1) setScrollBar('hidden')
    else if (element.clientHeight >= element.scrollHeight) setScrollBar('hidden')
    else setScrollBar('')
    setTimeout(() => {
      setScrollBar('hidden')
    }, 600)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, element.scrollTop])

  const scrollHandler = (e:any) => {
    setElement(e.target as HTMLElement)
    // console.log(element.scrollHeight)
    if (element) {
      let ratio = element.scrollTop / ( element.scrollHeight - element.clientHeight)
      if (!isNaN(ratio) && !isNaN(thumbHeight)) setThumbStyle({
        height: thumbHeight !== -1 ? thumbHeight : '100%',
        top: ratio * element.clientHeight > 0 ? ratio * ( element.clientHeight - thumbHeight ) : 0
      })
      setThumbHeight(element.clientHeight * element.clientHeight / element.scrollHeight || element.clientHeight)
    }
  }

  return (<div className={`list-component ${className}`}>
    <div className={`scrollBar ${scrollBar}`}>
      <div className="scrollThumb" style={thumbStyle}></div>
    </div>
    <div className="wrapper" onScroll={scrollHandler}>
      { children }
    </div>
  </div>)
}

export default List