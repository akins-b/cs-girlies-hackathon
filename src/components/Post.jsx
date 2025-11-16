import React, { useEffect, useState } from "react"
import './Post.css'
import CommentsPanel from './CommentsPanel'

function Post({ post }){
    const { id, author, title, content, tags = [], likes = 0, comments = 0, time } = post
    const [likesCount, setLikesCount] = useState(Number(likes) || 0)
    const [liked, setLiked] = useState(false)
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

    return (
        <article className="post-card">
            <header className="post-card-header">
                <div className="post-author">{ author }</div>
                <div className="post-meta">{ time }</div>
            </header>

            <h3 className="post-title">{ title }</h3>
            <p className="post-content">{ content }</p>

            <div className="post-tags">
                { tags.map((t) => (
                    <span key={t} className="post-tag">#{t}</span>
                ))}
            </div>

            <footer className="post-card-footer">
                <div className="post-actions">
                    <button aria-pressed={liked} onClick={toggleLike} className={`action ${liked ? 'liked' : ''}`}>
                        👍 {likesCount}
                    </button>
                    <button className="action" onClick={toggleComments}>💬 {commentsCount}</button>
                </div>
            </footer>

            {showComments && (
                <CommentsPanel postId={id} initialComments={commentsList} />
            )}
        </article>
    )
}

export default Post