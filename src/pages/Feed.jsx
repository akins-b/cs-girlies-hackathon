import React, { useEffect, useState } from 'react'
import Post from '../components/Post'

function Feed({ posts = [] }) {
    const [displayPosts, setDisplayPosts] = useState(posts || [])

    useEffect(() => {
        const compute = () => {
            try {
                const rawAll = localStorage.getItem('posts')
                const all = rawAll ? JSON.parse(rawAll) : []

                const rawUser = localStorage.getItem('userProfile')
                const user = rawUser ? JSON.parse(rawUser) : null
                const following = user && Array.isArray(user.following) ? user.following.map(s => String(s).toLowerCase()) : []

                // base posts come from props (already potentially filtered by interests)
                const base = Array.isArray(posts) ? posts.slice() : []
                const baseIds = new Set(base.map(p => String(p.id)))

                // include entries authored by people the current user follows
                const extras = (all || []).filter(p => {
                    try{
                        const authorId = p.authorId ? String(p.authorId).toLowerCase() : null
                        const authorName = p.author ? String(p.author).toLowerCase() : null
                        return (authorId && following.includes(authorId)) || (authorName && following.includes(authorName))
                    }catch(e){ return false }
                }).filter(p => !baseIds.has(String(p.id)))

                // merge and sort by createdAt (newest first) when available, fall back to id
                const merged = [...base, ...extras].sort((a,b)=>{
                    const ta = a.createdAt ? Number(a.createdAt) : Number(a.id || 0)
                    const tb = b.createdAt ? Number(b.createdAt) : Number(b.id || 0)
                    return tb - ta
                })

                setDisplayPosts(merged)
            } catch (e) {
                setDisplayPosts(posts || [])
            }
        }

        // compute initially
        compute()

        // recompute when posts prop changes or on relevant events
        const onPostsUpdated = () => compute()
        const onProfileUpdated = () => compute()
        const onProfilesMapUpdated = () => compute()

        window.addEventListener('postsUpdated', onPostsUpdated)
        window.addEventListener('userProfileUpdated', onProfileUpdated)
        window.addEventListener('user_profiles_updated', onProfilesMapUpdated)

        return () => {
            window.removeEventListener('postsUpdated', onPostsUpdated)
            window.removeEventListener('userProfileUpdated', onProfileUpdated)
            window.removeEventListener('user_profiles_updated', onProfilesMapUpdated)
        }
    }, [posts])

    if (!displayPosts || displayPosts.length === 0) {
        return (
            <main>
                <p style={{ color: '#9fb4c8' }}>No entries yet — create the first one.</p>
            </main>
        )
    }

    return (
        <main>
            {displayPosts.map((p) => (
                <Post key={p.id} post={p} />
            ))}
        </main>
    )
}

export default Feed