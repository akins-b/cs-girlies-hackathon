import React, { useEffect, useRef, useState } from "react"
import "./SideBar.css"

function SideBar({ user }) {
    // guard against null (user may be null when not signed in); use empty object
    const { firstName, lastName, name, username, level, xp = 0, xpGoal = 2000, streak = 0 } = user || {}
    // compute a friendly display name: prefer first+last, then name, then username
    const displayName = (firstName || lastName)
        ? `${(firstName || '').trim()} ${(lastName || '').trim()}`.trim()
        : (name || username || 'You')
    // derive posts count dynamically from persisted posts. If posts were
    // provided on the user object use that, otherwise read from localStorage
    // and count posts authored by the current user (match by username or full name)
    let postsCount = 0
    try{
        const raw = localStorage.getItem('posts')
        const posts = raw ? JSON.parse(raw) : []
        if (Array.isArray(posts) && user) {
            const nameLower = (user.name || '').toLowerCase()
            const usernameLower = (user.username || '').toLowerCase()
            postsCount = posts.filter(p => {
                const author = (p.author || '').toLowerCase()
                return (usernameLower && author === usernameLower) || (nameLower && author === nameLower) || (author === 'you' && (user && (user.username || user.name)))
            }).length
        }
    }catch(e){ postsCount = 0 }

    // derive a level label when not provided
    const levelLabel = level || `Level ${Math.max(1, Math.floor((xp || 0) / 1000) + 1)} Scholar`
    const progress = xpGoal ? Math.round((xp / xpGoal) * 100) : 0

    // animation state: bump when streak increases
    const [bump, setBump] = useState(false)
    const prevStreakRef = useRef(streak)
    useEffect(()=>{
        const prev = prevStreakRef.current || 0
        if (streak > prev) {
            setBump(true)
            const t = setTimeout(()=>setBump(false), 900)
            return ()=> clearTimeout(t)
        }
        prevStreakRef.current = streak
    }, [streak])

    return (
        <aside className="side-bar">
            <div className="profile-card">
                <div className="profile-name"> { displayName }</div>
                <div className="profile-level"> { levelLabel }</div>

                <div className="xp-section">
                    <div className="xp-row">
                        <div className="xp-label">XP Progress</div>
                        <div className="xp-percent"> {progress}%</div>
                    </div>

                    <div className="xp-bar">
                        <div className="xp-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="xp-count">{xp}/{xpGoal} XP</div>
                </div>

                <div className="stats">
                    <div className="stat">
                        <div className="stat-label">Daily Streak</div>
                        <div className={`stat-value ${bump ? 'streak-bump' : ''}`}>🔥 {streak} Days</div>
                    </div>
                    <div className="stat">
                        <div className="stat-label">Entries Created</div>
                        <div className="stat-value">✍️ {postsCount}</div>
                    </div>
                </div>

                <div className="quick-links">
                    <button className="link-btn my-notes" onClick={()=>{ window.location.href = '/notes' }}>My Notes</button>
                </div>
            </div>

        </aside>
    )
}

export default SideBar
