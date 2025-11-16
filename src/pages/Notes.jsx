import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Notes.css'

export default function Notes(){
  const [drafts, setDrafts] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    const load = ()=>{
      try{
        const raw = localStorage.getItem('draftEntries')
        const arr = raw ? JSON.parse(raw) : []
        setDrafts(arr)
      }catch(e){ setDrafts([]) }
    }
    load()
    const onStorage = (e)=>{
      if (e.key === 'draftEntries') load()
    }
    const onEvent = (e)=>{ if (e && e.detail) setDrafts(e.detail) }
    window.addEventListener('storage', onStorage)
    try{ window.addEventListener('draftsUpdated', onEvent) }catch(e){}
    return ()=>{
      window.removeEventListener('storage', onStorage)
      try{ window.removeEventListener('draftsUpdated', onEvent) }catch(e){}
    }
  }, [])

  function handleEdit(d){
    navigate('/new-post', { state: { initialDraft: d } })
  }

  function handleDelete(id){
    try{
      const raw = localStorage.getItem('draftEntries')
      const arr = raw ? JSON.parse(raw) : []
      const updated = arr.filter(d=>d.id !== id)
      try{ localStorage.setItem('draftEntries', JSON.stringify(updated)) }catch(e){}
      try{ window.dispatchEvent(new CustomEvent('draftsUpdated', { detail: updated })) }catch(e){}
      setDrafts(updated)
    }catch(e){ console.error('delete draft failed', e) }
  }

  return (
    <main className="notes-page container">
      <h1>My Notes</h1>
      {(!drafts || drafts.length===0) ? (
        <p className="empty">No draft entries yet.</p>
      ) : (
        <div className="draft-list">
          {drafts.map(d => (
            <article key={d.id} className="draft-item">
              <div className="draft-meta">
                <h3 className="draft-title">{d.title}</h3>
                <div className="draft-saved">Saved {new Date(d.savedAt || Date.now()).toLocaleString()}</div>
              </div>
              <p className="draft-excerpt">{(d.content || '').slice(0,200)}{(d.content||'').length>200? '…':''}</p>
              <div className="draft-actions">
                <button className="btn-primary" onClick={()=>handleEdit(d)}>Edit</button>
                <button className="btn-secondary" onClick={()=>handleDelete(d.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
