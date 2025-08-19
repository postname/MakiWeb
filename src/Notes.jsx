import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import './App.css'
import './Notes.css'

const files = import.meta.glob('/src/notes/**/*.md', { as: 'raw', eager: true })

// Organize files by folder
const notesByFolder = {}
Object.entries(files).forEach(([path, content]) => {
  const parts = path.split('/')
  const folder = parts[3] || 'Root'
  const file = parts.slice(4).join('/')
  if (!notesByFolder[folder]) notesByFolder[folder] = {}
  notesByFolder[folder][file] = content
})

const folderNames = Object.keys(notesByFolder)
const firstFolder = folderNames[0]
const firstFile = firstFolder ? Object.keys(notesByFolder[firstFolder])[0] : null

function Notes() {
  const [selectedFolder, setSelectedFolder] = useState(firstFolder)
  const [selectedFile, setSelectedFile] = useState(firstFile)
  const [expandedFolders, setExpandedFolders] = useState(
    folderNames.reduce((acc, folder) => ({ ...acc, [folder]: true }), {})
  )
  const [fontSize, setFontSize] = useState(1.1) // em

  useEffect(() => {
    document.title = "Notes"
  }, [])

  const content =
    selectedFolder && selectedFile
      ? notesByFolder[selectedFolder][selectedFile]
      : ''

  const handleFolderClick = (folder) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }))
    if (!expandedFolders[folder] && Object.keys(notesByFolder[folder]).length > 0) {
      setSelectedFolder(folder)
      setSelectedFile(Object.keys(notesByFolder[folder])[0])
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#23243a', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div className="notes-sidebar">
        <div className="notes-sidebar-top">
          <Link to="/" className="btn" style={{ marginBottom: '1em', alignSelf: 'flex-start', fontSize: '1.5em', padding: '0.3em 0.5em' }} title="Home">🏠</Link>
        </div>
        <div className="notes-sidebar-list">
          {folderNames.map(folder => (
            <div key={folder} className="notes-folder">
              <button
                className={`notes-folder-btn${folder === selectedFolder ? ' pressed' : ''}`}
                onClick={() => handleFolderClick(folder)}
                type="button"
              >
                <span style={{
                  display: 'inline-block',
                  width: 18,
                  textAlign: 'center',
                  marginRight: 6,
                  fontSize: '1.1em'
                }}>
                  {expandedFolders[folder] ? '▼' : '▶'}
                </span>
                <span>{folder}</span>
              </button>
              {expandedFolders[folder] && (
                <div>
                  {Object.keys(notesByFolder[folder]).map(file => (
                    <button
                      key={file}
                      className={`notes-file-btn${folder === selectedFolder && file === selectedFile ? ' pressed' : ''}`}
                      onClick={() => {
                        setSelectedFolder(folder)
                        setSelectedFile(file)
                      }}
                      type="button"
                    >
                      {file}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Main content */}
      <div className="notes-main">
        {/* Top bar */}
        <div className="notes-topbar" style={{ gap: "1em" }}>
          <span style={{ fontSize: '1.5em' }}>📝</span>
          {selectedFile && (
            <span style={{ fontWeight: 'normal', fontSize: '1em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60vw' }}>
              {selectedFile}
            </span>
          )}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5em" }}>
            <button className="btn" style={{ fontSize: "1.1em", padding: "0.2em 0.6em" }} onClick={() => setFontSize(f => Math.max(0.8, f - 0.1))} title="Smaller text">A-</button>
            <button className="btn" style={{ fontSize: "1.1em", padding: "0.2em 0.6em" }} onClick={() => setFontSize(1.1)} title="Reset text size">A</button>
            <button className="btn" style={{ fontSize: "1.1em", padding: "0.2em 0.6em" }} onClick={() => setFontSize(f => Math.min(2, f + 0.1))} title="Larger text">A+</button>
          </div>
        </div>
        {/* Preview */}
        <div className="notes-preview-container">
          {content ? (
            <div className="notes-preview" style={{ fontSize: `${fontSize}em` }}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <div style={{ color: '#888', margin: '2em auto', fontSize: '1.2em' }}>Select a note to preview.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notes