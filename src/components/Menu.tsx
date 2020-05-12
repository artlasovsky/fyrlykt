import React, { useEffect, useState } from 'react'
import Device from './Device'
import '../style/menu.scss'
import { remote, shell } from 'electron'

const Menu = () => {
  const [lastRelease, setLastRelease] = useState({ version: '', link: ''})
  const appVersion = remote.app.getVersion()
  useEffect(() => {
    const getVersion = async () => {
      const response = await fetch('https://api.github.com/repos/artlasovsky/fyrlykt/releases/latest')
      const release = await response.json()
      // setLastBuild({ version: '0.1.3', link: lastBuild.browser_download_url })
      setLastRelease({ version: release.tag_name, link: release.browser_download_url })
    }
    getVersion()
  },[])

  return (
  <div className="menu">
    <div className="left">
      <h1>Fyrlykt</h1>
      <div className="splitter"></div>
      <Device />
    </div>
    <div className="right">
      <p className="link" onClick={() => shell.openExternal("https://github.com/artlasovsky/fyrlykt")}>Git Hub</p>
      <div className="splitter"></div>
      <p className="link" onClick={() => shell.openExternal("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KACYGFTZSTPBW")}>Donate</p>
      <div className="splitter"></div>
      {lastRelease.version?.length > 0 && appVersion.replace(/[^0-9]/, '') < lastRelease.version.replace(/[^0-9]/, '') ?
        <p className="link update" onClick={() => shell.openExternal("https://artlasovsky.com/loupedeck-resolve")}>Update Available! ({lastRelease.version})</p>
        :
        <p>{appVersion}</p>
      }
    </div>
  </div>
  )
}

export default Menu