import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import './App.css'

function Notes() {
  const [markdown, setMarkdown] = useState('# My Notes\n\nStart writing your notes in **Markdown**!')

  return (
    <div className="card">
      <h1>Notes</h1>
      <Link to="/" className="btn" style={{ background: "#3a3f5c", marginBottom: "1em" }}>🏠 Home</Link>
      <textarea
        value={markdown}
        onChange={e => setMarkdown(e.target.value)}
        rows={10}
        style={{ width: "100%", marginBottom: "1em", borderRadius: "6px", padding: "0.5em" }}
      />
      <div style={{ textAlign: "left", background: "#f8fafc", borderRadius: "6px", padding: "1em" }}>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  )
}

export default Notes