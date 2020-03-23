import React from 'react'
import { Key } from '../../store'

const KeyModule = ({ activeKey }: { activeKey: Key }) => {
  return (
    <div className="key">
      { activeKey.name ? 
        <p className="name">{activeKey.name}</p>
        :
        <p>Press any key on your panel</p>
      }
    </div>
  )
}

export default KeyModule