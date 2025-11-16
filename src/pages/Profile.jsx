import React, { useEffect, useState } from 'react'
import UserSection from '../components/UserSection.jsx'
import ProfileTabs from '../components/ProfileTabs.jsx'

function Profile(){
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

        return ()=>{
            window.removeEventListener('storage', onStorage)
            window.removeEventListener('userProfileUpdated', onProfileUpdated)
            window.removeEventListener('postsUpdated', onPostsUpdated)
        }
    }, [])

    // fallback user when not logged in
    const displayUser = user || { name: 'Jordan Smith', username: 'jordansmith', avatar:'', xp:15420, xpGoal:20000, streak:45 }

    return (
        <div>
            <UserSection user={displayUser} />
            <ProfileTabs posts={userPosts} />
        </div>
    )
}

export default Profile