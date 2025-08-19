import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import { useEffect } from 'react'
import Notes from './Notes'
import './App.css'

function Home() {
  useEffect(() => {
    document.title = "Home"
  }, [])

  return (
    <div className="card">
      <h1>MakiSec</h1>
      <p>Cloud and Security student</p>
      <a href="https://linkedin.com/in/filler" target="_blank" rel="noopener noreferrer" className="btn linkedin">
        <FaLinkedin style={{ marginRight: '8px' }} />LinkedIn
      </a>
      <a href="https://github.com/filler" target="_blank" rel="noopener noreferrer" className="btn github">
        <FaGithub style={{ marginRight: '8px' }} />GitHub
      </a>
      <Link to="/notes" className="btn" style={{ background: "#3a3f5c" }}>📝 Notes</Link>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </Router>
  )
}

export default App
