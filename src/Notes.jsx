import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import './App.css'
import './Notes.css'

const files = import.meta.glob('/src/notes/**/*.md', { as: 'raw', eager: true })

// Organize files by folder
const notesByFolder = {}
Object.entries(files).forEach(([path, content]) => {
  // path: '/src/notes/folder/file.md'
  const parts = path.split('/')
  const folder = parts[3] || 'Root'
  const file = parts.slice(4).join('/') // supports subfolders
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

  const content =
    selectedFolder && selectedFile
      ? notesByFolder[selectedFolder][selectedFile]
      : ''

  const handleFolderClick = (folder) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }))
    // If collapsing, don't change selection. If expanding, select first file if none selected.
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
          <Link to="/" className="btn" style={{ marginBottom: '1em', alignSelf: 'flex-start' }}>🏠 Home</Link>
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
        <div className="notes-topbar">
          <span style={{ fontSize: '1.5em', marginRight: '0.5em' }}>📝</span>
          Notes App
          {selectedFile && (
            <span style={{ marginLeft: '2em', fontWeight: 'normal', fontSize: '1em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60vw' }}>
              {selectedFile}
            </span>
          )}
        </div>
        {/* Preview */}
        <div className="notes-preview-container">
          {content ? (
            <div className="notes-preview">
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