import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Post from '../components/Post'

export default function PostPage(){
  const { id } = useParams()
  const navigate = useNavigate()

  const postId = Number(id)
  let post = null
  try{
    const raw = localStorage.getItem('posts')
    const posts = raw ? JSON.parse(raw) : []
    post = posts.find(p=>Number(p.id) === postId) || null
  }catch(e){ post = null }

  if (!post) return (
    <main style={{ padding: 20 }}>
      <p style={{ color:'#9fb4c8' }}>Post not found.</p>
      <button className="btn-secondary" onClick={()=>navigate('/home')}>Back to feed</button>
    </main>
  )

  return (
    <main style={{ padding: 20 }}>
      <Post post={post} />
    </main>
  )
}
