import React, { useEffect, useState } from "react"
import './Post.css'
import CommentsPanel from './CommentsPanel'

function Post({ post }){
    const { id, author, authorId, title, content, tags = [], likes = 0, comments = 0, time, createdAt } = post
    const [likesCount, setLikesCount] = useState(Number(likes) || 0)
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [commentsList, setCommentsList] = useState(() => Array.isArray(comments) ? comments : [])
    const [commentText, setCommentText] = useState('')

    useEffect(()=>{
        // determine liked state from localStorage (browser-specific)
        try{
            const raw = localStorage.getItem('likedPostIds')
            const likedIds = raw ? JSON.parse(raw) : []
            setLiked(Array.isArray(likedIds) && likedIds.includes(id))
            // keep local likesCount in sync with persisted posts if available
            const rawPosts = localStorage.getItem('posts')
            if (rawPosts){
                const posts = JSON.parse(rawPosts)
                const p = posts.find(pp => pp.id === id)
                if (p && typeof p.likes === 'number') setLikesCount(p.likes)
                // sync comments list if present
                if (p && Array.isArray(p.comments)) setCommentsList(p.comments)
            }
        }catch(e){}
    }, [id])

    useEffect(()=>{
        // track saved state per-user
        try{
            const rawUser = localStorage.getItem('userProfile')
            const u = rawUser ? JSON.parse(rawUser) : null
            const savedIds = u && Array.isArray(u.savedPosts) ? u.savedPosts : []
            setSaved(Array.isArray(savedIds) && savedIds.includes(id))
        }catch(e){}
        const onProfileUpdated = (e)=>{
            try{
                const u = e && e.detail ? e.detail : (localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : null)
                const savedIds = u && Array.isArray(u.savedPosts) ? u.savedPosts : []
                setSaved(Array.isArray(savedIds) && savedIds.includes(id))
            }catch(err){}
        }
        window.addEventListener('userProfileUpdated', onProfileUpdated)
        return ()=> window.removeEventListener('userProfileUpdated', onProfileUpdated)
    }, [id])

    useEffect(()=>{
        const onPostsUpdated = (e) => {
            try{
                const posts = e && e.detail ? e.detail : (localStorage.getItem('posts') ? JSON.parse(localStorage.getItem('posts')) : [])
                const p = posts.find(pp => pp.id === id)
                if (p) {
                    if (typeof p.likes === 'number') setLikesCount(p.likes)
                    if (Array.isArray(p.comments)) setCommentsList(p.comments)
                }
            }catch(err){ }
        }
        window.addEventListener('postsUpdated', onPostsUpdated)
        return ()=> window.removeEventListener('postsUpdated', onPostsUpdated)
    }, [id])

    const toggleLike = () => {
        try{
            // load liked ids and compute whether it's currently liked
            const raw = localStorage.getItem('likedPostIds')
            const likedIds = raw ? JSON.parse(raw) : []
            const has = Array.isArray(likedIds) && likedIds.includes(id)

            // update posts array in localStorage with the new likes count
            const rawPosts = localStorage.getItem('posts')
            const posts = rawPosts ? JSON.parse(rawPosts) : []
            const updatedPosts = posts.map(p => {
                if (p.id === id){
                    const newLikes = (Number(p.likes) || 0) + (has ? -1 : 1)
                    return { ...p, likes: Math.max(0, newLikes) }
                }
                return p
            })

            // update liked ids locally and persist BEFORE dispatching the postsUpdated event
            let newLikedIds = Array.isArray(likedIds) ? [...likedIds] : []
            if (has) newLikedIds = newLikedIds.filter(x => x !== id)
            else newLikedIds.push(id)
            try{ localStorage.setItem('likedPostIds', JSON.stringify(newLikedIds)) }catch(e){}

            // optimistically update local liked flag
            setLiked(!has)

            // persist updated posts and notify listeners
            try{ localStorage.setItem('posts', JSON.stringify(updatedPosts)) }catch(e){}
            try{ window.dispatchEvent(new CustomEvent('postsUpdated', { detail: updatedPosts })) }catch(e){}
        }catch(e){ console.error('toggleLike error', e) }
    }

    const toggleComments = () => setShowComments(s => !s)

    const commentsCount = Array.isArray(commentsList) ? commentsList.length : (typeof comments === 'number' ? comments : 0)

    // determine display name for author: prefer an explicit authorId on the post
    // If authorId matches the logged-in user's username or name, show 'You'.
    // Otherwise fall back to previous string-based matching (for old posts without authorId).
    const displayAuthor = (()=>{
        try{
            const rawUser = localStorage.getItem('userProfile')
            const u = rawUser ? JSON.parse(rawUser) : null
            if (authorId && u){
                const aid = (authorId || '').toString()
                if (aid && (aid === (u.username || '') || aid === (u.name || ''))) return 'You'
            }
            // fallback: string match as before
            const authorLower = (author || '').toLowerCase()
            const usernameLower = u && u.username ? (u.username || '').toLowerCase() : null
            const nameLower = u && u.name ? (u.name || '').toLowerCase() : null
            if (usernameLower && authorLower === usernameLower) return 'You'
            if (nameLower && authorLower === nameLower) return 'You'
            if (authorLower === 'you') return 'You'
        }catch(e){}
        return author
    })()

    // compute a friendly relative time using createdAt when available
    const relativeTime = (()=>{
        try{
            if (createdAt) {
                const delta = Math.floor((Date.now() - Number(createdAt)) / 1000)
                if (delta < 60) return `${delta}s ago`
                if (delta < 3600) return `${Math.floor(delta/60)}m ago`
                if (delta < 86400) return `${Math.floor(delta/3600)}h ago`
                return `${Math.floor(delta/86400)}d ago`
            }
        }catch(e){}
        return time || ''
    })()

    return (
        <article className="post-card">
            <header className="post-card-header">
                <div className="post-author">{ displayAuthor }</div>
                <div className="post-meta">{ relativeTime }</div>
            </header>

            <h3 className="post-title">{ title }</h3>
            <p className="post-content">{ content }</p>

            <div className="post-tags">
                { tags.map((t) => (
                    <span key={t} className="post-tag">#{t}</span>
                ))}
            </div>

            <footer className="post-card-footer">
                <div className="post-actions-left">
                    <button aria-pressed={liked} onClick={toggleLike} className={`action ${liked ? 'liked' : ''}`}>
                        👍 {likesCount}
                    </button>
                    <button className="action" onClick={toggleComments}>💬 {commentsCount}</button>
                </div>
                <div className="post-actions-right">
                    <button aria-pressed={saved} aria-label={saved ? 'Unsave post' : 'Save post'} title={saved ? 'Unsave post' : 'Save post'} onClick={async ()=>{
                        try{
                            // toggle saved in userProfile.savedPosts
                            const rawUser = localStorage.getItem('userProfile')
                            if (!rawUser) return
                            const u = JSON.parse(rawUser)
                            const arr = Array.isArray(u.savedPosts) ? [...u.savedPosts] : []
                            const has = arr.includes(id)
                            const newArr = has ? arr.filter(x=>x!==id) : [...arr, id]
                            u.savedPosts = newArr
                            // optimistically update UI
                            try{ setSaved(!has) }catch(e){}
                                    try{ localStorage.setItem('userProfile', JSON.stringify(u)) }catch(e){}
                                    // also persist into per-username profiles so saved posts survive logout/login
                                    try{
                                        const rawMap = localStorage.getItem('user_profiles')
                                        const map = rawMap ? JSON.parse(rawMap) : {}
                                        if (u && u.username) {
                                            map[u.username] = u
                                            try{ localStorage.setItem('user_profiles', JSON.stringify(map)) }catch(e){}
                                        }
                                    }catch(e){}
                                    try{ window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: u })) }catch(e){}
                        }catch(err){ console.error('toggle save failed', err) }
                    }} className={`action save ${saved ? 'saved' : ''}`}>
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="18" height="18">
                            <path d="M6 2h12v18l-6-3-6 3V2z"/>
                        </svg>
                    </button>
                </div>
            </footer>

            

            {showComments && (
                <CommentsPanel postId={id} initialComments={commentsList} />
            )}
        </article>
    )
}

export default Post