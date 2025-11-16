import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Feed from './Feed'

export default function TagPage(){
  const { tag } = useParams()
  const navigate = useNavigate()
  let posts = []
  try{
    const raw = localStorage.getItem('posts')
    const all = raw ? JSON.parse(raw) : []
    const t = decodeURIComponent(tag || '')
    posts = all.filter(p => Array.isArray(p.tags) && p.tags.some(tt => String(tt).toLowerCase() === t.toLowerCase()))
  }catch(e){ posts = [] }

  return (
    <main style={{ padding: 20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <h2>Tag: {decodeURIComponent(tag || '')}</h2>
        <button className="btn-secondary" onClick={()=>navigate('/home')}>Back</button>
      </div>
      <Feed posts={posts} />
    </main>
  )
}
