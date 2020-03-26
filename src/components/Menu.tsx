import React from 'react'
import Device from './Device'
import '../style/menu.scss'
import { remote } from 'electron'

const Menu = () => {
  // const close = () => {
  //   console.log('close')
  //   let w = remote.getCurrentWindow()
  //   w.close()
  // }
  // const hide = () => {
  //   console.log('close')
  //   let w = remote.getCurrentWindow()
  //   w.hide()
  // }

  return (
  <div className="menu">
    <div className="left">
      <h1>Fyrlykt</h1>
      <div className="splitter"></div>
      <Device />
    </div>
    <div className="right">
      <a href="https://github.com/artlasovsky/fyrlykt">Git Hub</a>
      <div className="splitter"></div>
      <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KACYGFTZSTPBW">Donate</a>
      <div className="splitter"></div>
      <p>{remote.app.getVersion()}</p>
      {/* <div className="window-controls">
        <p className="close link" onClick={hide}>hide</p>
        <p className="close link" onClick={close}>close</p>
      </div> */}
    </div>
  </div>
  )
}

export default Menu