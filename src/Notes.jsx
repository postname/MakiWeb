import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import './App.css'

// Helper functions for localStorage
const STORAGE_KEY = 'makiweb_notes_v1'

function getInitialNotes() {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) return JSON.parse(data)
  // Example structure: { "folder1": { "note1.md": "content" }, ... }
  return {
    "Personal": {
      "welcome.md": "# Welcome\n\nThis is your first note!"
    }
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

function Notes() {
  const [notes, setNotes] = useState(getInitialNotes())
  const [selectedFolder, setSelectedFolder] = useState(Object.keys(notes)[0])
  const [selectedFile, setSelectedFile] = useState(Object.keys(notes[selectedFolder])[0])
  const [content, setContent] = useState(notes[selectedFolder][selectedFile])
  const [editing, setEditing] = useState(false)

  // Update content when switching files
  useEffect(() => {
    setContent(notes[selectedFolder][selectedFile])
    setEditing(false)
  }, [selectedFolder, selectedFile, notes])

  // Auto-save on content change
  useEffect(() => {
    setNotes(prev => {
      const updated = {
        ...prev,
        [selectedFolder]: {
          ...prev[selectedFolder],
          [selectedFile]: content
        }
      }
      saveNotes(updated)
      return updated
    })
    // eslint-disable-next-line
  }, [content])

  // Folder and file navigation
  const handleSelect = (folder, file) => {
    setSelectedFolder(folder)
    setSelectedFile(file)
  }

  // Create new note
  const handleNewNote = () => {
    const name = prompt('Enter note name (with .md):', 'new-note.md')
    if (!name) return
    setNotes(prev => {
      const updated = {
        ...prev,
        [selectedFolder]: {
          ...prev[selectedFolder],
          [name]: '# New Note'
        }
      }
      saveNotes(updated)
      return updated
    })
    setSelectedFile(name)
  }

  // Create new folder
  const handleNewFolder = () => {
    const name = prompt('Enter folder name:')
    if (!name || notes[name]) return
    setNotes(prev => {
      const updated = { ...prev, [name]: {} }
      saveNotes(updated)
      return updated
    })
    setSelectedFolder(name)
    setSelectedFile(null)
  }

  // Delete note
  const handleDeleteNote = () => {
    if (!window.confirm('Delete this note?')) return
    setNotes(prev => {
      const updated = { ...prev }
      delete updated[selectedFolder][selectedFile]
      // If folder is empty, remove it
      if (Object.keys(updated[selectedFolder]).length === 0) {
        delete updated[selectedFolder]
        // Select another folder if possible
        const folders = Object.keys(updated)
        setSelectedFolder(folders[0] || null)
        setSelectedFile(folders[0] ? Object.keys(updated[folders[0]])[0] : null)
      } else {
        // Select another file in the folder
        const files = Object.keys(updated[selectedFolder])
        setSelectedFile(files[0])
      }
      saveNotes(updated)
      return updated
    })
  }

  // Delete folder
  const handleDeleteFolder = () => {
    if (!window.confirm('Delete this folder and all its notes?')) return
    setNotes(prev => {
      const updated = { ...prev }
      delete updated[selectedFolder]
      const folders = Object.keys(updated)
      setSelectedFolder(folders[0] || null)
      setSelectedFile(folders[0] ? Object.keys(updated[folders[0]])[0] : null)
      saveNotes(updated)
      return updated
    })
  }

  // UI
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#23243a' }}>
      {/* Sidebar */}
      <div style={{
        width: 220, background: '#181825', color: '#fff', padding: '1em 0.5em', display: 'flex', flexDirection: 'column'
      }}>
        <Link to="/" className="btn" style={{ marginBottom: '1em', alignSelf: 'flex-start' }}>🏠 Home</Link>
        <button className="btn" style={{ background: '#3a3f5c', marginBottom: 8 }} onClick={handleNewFolder}>+ Folder</button>
        {Object.keys(notes).map(folder => (
          <div key={folder} style={{ marginBottom: 8 }}>
            <div
              className={`btn${folder === selectedFolder ? ' pressed' : ''}`}
              style={{
                background: folder === selectedFolder ? '#3a3f5c' : '#23243a',
                width: '100%',
                marginBottom: 4,
                justifyContent: 'flex-start'
              }}
              onClick={() => { setSelectedFolder(folder); setSelectedFile(Object.keys(notes[folder])[0]) }}
            >
              📁 {folder}
              {folder === selectedFolder && (
                <button onClick={handleDeleteFolder} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>🗑️</button>
              )}
            </div>
            {/* Files */}
            {folder === selectedFolder && Object.keys(notes[folder]).map(file => (
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
                onClick={() => handleSelect(folder, file)}
              >
                📝 {file}
                {file === selectedFile && (
                  <button onClick={handleDeleteNote} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>🗑️</button>
                )}
              </div>
            ))}
            {folder === selectedFolder && (
              <button className="btn" style={{ background: '#23243a', width: '95%', margin: '2px 0 2px 1em', justifyContent: 'flex-start' }} onClick={handleNewNote}>+ New Note</button>
            )}
          </div>
        ))}
      </div>
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        {/* Top bar */}
        <div style={{
          height: 56, background: '#3a3f5c', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 1.5em', fontWeight: 'bold', fontSize: '1.1em'
        }}>
          {selectedFile ? selectedFile : 'No file selected'}
        </div>
        {/* Editor/Preview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1em', overflow: 'auto' }}>
          {selectedFile ? (
            <>
              <textarea
                value={content}
                onChange={e => { setContent(e.target.value); setEditing(true) }}
                rows={16}
                style={{
                  width: '100%',
                  minHeight: 180,
                  borderRadius: 6,
                  padding: '0.5em',
                  marginBottom: '1em',
                  fontFamily: 'monospace',
                  fontSize: '1em',
                  border: editing ? '2px solid #6c3483' : '1px solid #ccc',
                  background: '#fff'
                }}
              />
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
            </>
          ) : (
            <div style={{ color: '#888', margin: '2em auto', fontSize: '1.2em' }}>Select or create a note to get started.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notes