import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import './App.css'

// Import all markdown files in the notes directory and subdirectories
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

  const content =
    selectedFolder && selectedFile
      ? notesByFolder[selectedFolder][selectedFile]
      : ''

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#23243a' }}>
      {/* Sidebar */}
      <div style={{
        width: 220, background: '#181825', color: '#fff', padding: '1em 0.5em', display: 'flex', flexDirection: 'column'
      }}>
        <Link to="/" className="btn" style={{ marginBottom: '1em', alignSelf: 'flex-start' }}>🏠 Home</Link>
        {folderNames.map(folder => (
          <div key={folder} style={{ marginBottom: 8 }}>
            <div
              className={`btn${folder === selectedFolder ? ' pressed' : ''}`}
              style={{
                background: folder === selectedFolder ? '#3a3f5c' : '#23243a',
                width: '100%',
                marginBottom: 4,
                justifyContent: 'flex-start'
              }}
              onClick={() => {
                setSelectedFolder(folder)
                setSelectedFile(Object.keys(notesByFolder[folder])[0])
              }}
            >
              📁 {folder}
            </div>
            {/* Files */}
            {folder === selectedFolder && Object.keys(notesByFolder[folder]).map(file => (
              <div
                key={file}
                className={`btn${file === selectedFile ? ' pressed' : ''}`}
                style={{
                  background: file === selectedFile ? '#6c3483' : '#23243a',
                  width: '95%',
                  margin: '2px 0 2px 1em',
                  justifyContent: 'flex-start',
                  fontWeight: file === selectedFile ? 'bold' : 'normal'
                }}
                onClick={() => setSelectedFile(file)}
              >
                📝 {file}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        {/* Top bar */}
        <div style={{
          height: 56, background: '#3a3f5c', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 1.5em', fontWeight: 'bold', fontSize: '1.1em'
        }}>
          <span style={{ fontSize: '1.5em', marginRight: '0.5em' }}>📝</span>
          Notes App
          {selectedFile && (
            <span style={{ marginLeft: '2em', fontWeight: 'normal', fontSize: '1em' }}>
              {selectedFile}
            </span>
          )}
        </div>
        {/* Preview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1em', overflow: 'auto' }}>
          {content ? (
            <div style={{
              textAlign: 'left',
              background: '#fff',
              borderRadius: 6,
              padding: '1em',
              border: '1px solid #e0e7ff',
              boxShadow: '0 1px 4px rgba(60,72,88,0.06)'
            }}>
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