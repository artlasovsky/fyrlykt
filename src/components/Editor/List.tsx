import React, { FC, useState } from 'react'
import './List.scss'


const List:FC<{className: string}> = ({ children, className } ) => {
  const [element, setElement] = useState({} as Element)
  const [thumbHeight, setThumbHeight]:[number, Function] = useState(-1)
  const [thumbStyle, setThumbStyle] = useState({ top: 0 } as { height: number | string, top: number })
  
  const scrollHandler = (e:any) => {
    setElement(e.target as HTMLElement)
    let ratio = element.scrollTop / ( element.scrollHeight - element.clientHeight)
    if (!isNaN(ratio) && !isNaN(thumbHeight)) setThumbStyle({
      height: thumbHeight !== -1 ? thumbHeight : '100%',
      top: ratio * element.clientHeight > 0 ? ratio * ( element.clientHeight - thumbHeight ) : 0
    })
    console.log(thumbStyle)
    setThumbHeight(element.clientHeight * element.clientHeight / element.scrollHeight || element.clientHeight)
  }

  return (<div className={`list-component ${className}`}>
    <div className="scrollBar">
      <div className="scrollThumb" style={thumbStyle}></div>
    </div>
    <div className="wrapper" onScroll={scrollHandler}>
      { children }
    </div>
  </div>)
}

export default List