import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import UserSection from '../components/UserSection.jsx'
import ProfileTabs from '../components/ProfileTabs.jsx'

function Profile(){
    const { username: routeUsername } = useParams()
    const [user, setUser] = useState(()=>{
        try{
            const raw = localStorage.getItem('userProfile')
            return raw ? JSON.parse(raw) : null
        }catch(e){ return null }
    })

    const [userPosts, setUserPosts] = useState(()=>{
        try{
            const raw = localStorage.getItem('posts')
            return raw ? JSON.parse(raw) : []
        }catch(e){ return [] }
    })

    useEffect(()=>{
        // storage event for cross-tab updates
        const onStorage = (e)=>{
            try{
                if (e.key === 'userProfile') setUser(e.newValue ? JSON.parse(e.newValue) : null)
                if (e.key === 'posts') setUserPosts(e.newValue ? JSON.parse(e.newValue) : [])
            }catch(err){}
        }

        // custom event for same-tab updates
        const onProfileUpdated = (e) => {
            try{ const u = e && e.detail ? e.detail : null; setUser(u || (()=>{ const raw = localStorage.getItem('userProfile'); return raw ? JSON.parse(raw) : null })) }catch(err){}
        }
        const onPostsUpdated = (e) => {
            try{ const p = e && e.detail ? e.detail : null; setUserPosts(p || (()=>{ const raw = localStorage.getItem('posts'); return raw ? JSON.parse(raw) : [] })) }catch(err){}
        }

        window.addEventListener('storage', onStorage)
        window.addEventListener('userProfileUpdated', onProfileUpdated)
        window.addEventListener('postsUpdated', onPostsUpdated)
        const onUserProfilesUpdated = ()=>{
            // trigger a re-render so displayUser picks up changes from localStorage.user_profiles
            try{ const raw = localStorage.getItem('userProfile'); setUser(raw ? JSON.parse(raw) : null) }catch(e){}
        }
        window.addEventListener('user_profiles_updated', onUserProfilesUpdated)
        
        return ()=>{
            window.removeEventListener('storage', onStorage)
            window.removeEventListener('userProfileUpdated', onProfileUpdated)
            window.removeEventListener('postsUpdated', onPostsUpdated)
            window.removeEventListener('user_profiles_updated', onUserProfilesUpdated)
        }
    }, [])

    // If this route includes a username param, show that user's profile (otherwise show logged-in user's)
    const displayUser = (()=>{
        try{
            if (routeUsername) {
                const rawMap = localStorage.getItem('user_profiles')
                const map = rawMap ? JSON.parse(rawMap) : {}
                const key = decodeURIComponent(routeUsername)
                if (map && map[key]) return map[key]
            }
            return user || { name: 'Jordan Smith', username: 'jordansmith', avatar:'', xp:15420, xpGoal:20000, streak:45 }
        }catch(e){ return user || { name: 'Jordan Smith', username: 'jordansmith', avatar:'', xp:15420, xpGoal:20000, streak:45 } }
    })()

    // Only show posts authored by the displayed user in "My Posts"
    const authoredPosts = (()=>{
        try{
            if (!displayUser) return []
            const usernameLower = displayUser.username ? displayUser.username.toLowerCase() : null
            const nameLower = displayUser.name ? displayUser.name.toLowerCase() : null
            return (userPosts || []).filter(p => {
                const author = (p.author || '').toLowerCase()
                return (usernameLower && author === usernameLower) || (nameLower && author === nameLower) || author === 'you'
            })
        }catch(e){ return [] }
    })()

    const savedPosts = (()=>{
        try{
            if (!user) return []
            const savedIds = Array.isArray(user.savedPosts) ? user.savedPosts : []
            if (!savedIds.length) return []
            const ids = savedIds.map(x => Number(x))
            return (userPosts || []).filter(p => ids.includes(Number(p.id)))
        }catch(e){ return [] }
    })()

    // no-op: route-based navigation replaces previous localStorage-based viewUser approach

    const isViewingOther = Boolean(routeUsername)

    // defensive render: catch unexpected runtime errors and show a helpful message
    try {
        return (
            <div>
                <UserSection user={displayUser} isOther={isViewingOther} />
                <ProfileTabs posts={authoredPosts} savedPosts={savedPosts} showSaved={!isViewingOther} />
            </div>
        )
    } catch (err) {
        console.error('Profile render error', err)
        return (
            <main style={{ padding: 20 }}>
                <h2 style={{ color: '#fff' }}>Profile unavailable</h2>
                <p style={{ color: '#9fb4c8' }}>An error occurred while rendering the profile. Check the browser console for details.</p>
            </main>
        )
    }
}

export default Profile