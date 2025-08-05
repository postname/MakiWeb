import { useState } from 'react'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <title>MakiSec</title>
      <div className="card">
        <h1>MakiSec</h1>
        <p>Cloud and Security student</p>
        <a
          href="https://linkedin.com/in/filler"
          target="_blank"
          rel="noopener noreferrer"
          className="btn linkedin"
        >
          <FaLinkedin style={{ marginRight: '8px' }} />
          LinkedIn
        </a>
        <a
          href="https://github.com/filler"
          target="_blank"
          rel="noopener noreferrer"
          className="btn github"
        >
          <FaGithub style={{ marginRight: '8px' }} />
          GitHub
        </a>
      </div>
    </>
  )
}

export default App
