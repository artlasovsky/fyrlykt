import React from 'react'
import fs from 'fs'

const Test = () => {
  const [content, setContent] = React.useState([''])
  return <div>
    <p>{content.join('\n')}</p>
    <button onClick={() => setContent(fs.readdirSync('./'))}>click</button>
  </div>
}

export default Test