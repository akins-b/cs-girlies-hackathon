import React, { useEffect, useState } from 'react'
import './CommentsPanel.css'

function CommentsPanel({ postId, initialComments = [] }){
    const [comments, setComments] = useState(initialComments)
    const [text, setText] = useState('')

    useEffect(()=>{
        const onPostsUpdated = (e)=>{
            try{
                const posts = e && e.detail ? e.detail : (localStorage.getItem('posts') ? JSON.parse(localStorage.getItem('posts')) : [])
                const p = posts.find(pp=>pp.id === postId)
                setComments(p && Array.isArray(p.comments) ? p.comments : [])
            }catch(err){}
        }
        window.addEventListener('postsUpdated', onPostsUpdated)
        return ()=> window.removeEventListener('postsUpdated', onPostsUpdated)
    }, [postId])

    const add = ()=>{
        const v = (text||'').trim()
        if (!v) return
        try{
            const rawPosts = localStorage.getItem('posts')
            const posts = rawPosts ? JSON.parse(rawPosts) : []
            const updated = posts.map(p=>{
                if (p.id === postId){
                    const existing = Array.isArray(p.comments) ? p.comments : []
                    // include createdAt and authorId so comment metadata persists consistently
                    const currentUser = (()=>{ try{ const r = localStorage.getItem('userProfile'); return r?JSON.parse(r):null }catch(e){return null} })()
                    const newComment = {
                        id: Date.now(),
                        author: (currentUser && (currentUser.username || currentUser.name)) || 'You',
                        authorId: (currentUser && (currentUser.username || currentUser.name)) ? String((currentUser.username||currentUser.name)).toLowerCase().replace(/[^a-z0-9]/g,'') : null,
                        text: v,
                        createdAt: Date.now(),
                        time: 'just now'
                    }
                    return { ...p, comments: [...existing, newComment] }
                }
                return p
            })
            try{ localStorage.setItem('posts', JSON.stringify(updated)) }catch(e){}
            try{ window.dispatchEvent(new CustomEvent('postsUpdated', { detail: updated })) }catch(e){}
            // Award +30 XP to the commenter (if logged in)
            try{
                const rawUser = localStorage.getItem('userProfile')
                if (rawUser){
                    const u = JSON.parse(rawUser)
                    const currentXp = Number(u.xp || 0)
                    u.xp = currentXp + 30
                    try{ localStorage.setItem('userProfile', JSON.stringify(u)) }catch(e){}
                    // also persist into per-username profiles so comment XP is not lost on logout/login
                    try{
                        const rawMap = localStorage.getItem('user_profiles')
                        const map = rawMap ? JSON.parse(rawMap) : {}
                        if (u && u.username) {
                            map[u.username] = u
                            try{ localStorage.setItem('user_profiles', JSON.stringify(map)) }catch(e){}
                        }
                    }catch(e){}
                    try{ window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: u })) }catch(e){}
                }
            }catch(err){ console.error('award xp on comment failed', err) }

            setText('')
        }catch(err){ console.error('CommentsPanel.add error', err) }
    }

    return (
        <div className="comments-panel">
            <div className="comments-list">
                {comments && comments.length>0 ? comments.map(c=> (
                    <div key={c.id} className="comment-item">
                        <div className="comment-meta"><strong>{c.author}</strong> · <span className="comment-time">{c.time}</span></div>
                        <div className="comment-text">{c.text}</div>
                    </div>
                )) : (
                    <div className="no-comments">No comments yet. Be the first to comment.</div>
                )}
            </div>

            <div className="comment-input">
                <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write a comment..." />
                <div className="comment-actions">
                    <button className="btn-secondary" onClick={()=>setText('')}>Clear</button>
                    <button className="btn-primary" onClick={add}>Add Comment</button>
                </div>
            </div>
        </div>
    )
}

export default CommentsPanel
