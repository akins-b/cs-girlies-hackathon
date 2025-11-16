import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from 'react-router-dom'
import './UserSection.css'

function UserSection({ user = {} }) {
    const {
        name = '',
        username = '',
        firstName = '',
        lastName = '',
        avatar = '',
        xp = 0,
        xpGoal = 20000,
        streak = 0,
        longestStreak = 0,
    } = user

    const xpPercent = Math.round((xp / xpGoal) * 100)

    // animate streak when it increases
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

    const getInitials = () => {
        // prefer firstName + lastName when available
        if (firstName || lastName) {
            const a = firstName ? firstName.trim()[0] : (name ? name.trim().split(' ')[0][0] : (username ? username[0] : 'A'))
            const b = lastName ? lastName.trim()[0] : (firstName && firstName.trim().split(' ')[1] ? firstName.trim().split(' ')[1][0] : (name && name.trim().split(' ')[1] ? name.trim().split(' ')[1][0] : ''))
            return ( (a || '') + (b || '') ).toUpperCase()
        }
        // fallback to name initials
        if (name) return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()
        // final fallback: username first two chars
        return (username ? username.slice(0,2) : 'AD').toUpperCase()
    }

    const avatarRef = useRef(null)
    const menuRef = useRef(null)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(()=>{
        const onDocClick = (e)=>{
            if (!menuOpen) return
            if (menuRef.current && menuRef.current.contains(e.target)) return
            if (avatarRef.current && avatarRef.current.contains(e.target)) return
            setMenuOpen(false)
        }
        const onEsc = (e)=>{ if (e.key === 'Escape') setMenuOpen(false) }
        document.addEventListener('click', onDocClick)
        document.addEventListener('keydown', onEsc)
        return ()=>{
            document.removeEventListener('click', onDocClick)
            document.removeEventListener('keydown', onEsc)
        }
    }, [menuOpen])

    const navigate = useNavigate()
    const doLogout = () => {
        try{
            // persist profile per-username so it can be restored next login
            try{
                const raw = localStorage.getItem('userProfile')
                if (raw){
                    const p = JSON.parse(raw)
                    const usernameKey = p && p.username ? p.username : null
                    if (usernameKey){
                        const rawMap = localStorage.getItem('user_profiles')
                        const map = rawMap ? JSON.parse(rawMap) : {}
                        map[usernameKey] = p
                        localStorage.setItem('user_profiles', JSON.stringify(map))
                    }
                }
            }catch(e){}
            localStorage.removeItem('userProfile')
            localStorage.removeItem('userLoggedIn')
            try{ localStorage.removeItem('userInterests') }catch(e){}
            try{ window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: null })) }catch(e){}
        }catch(e){ console.error('logout failed', e) }
        navigate('/login')
    }

    return (
        <header className="profile-header">
            <div className="profile-left">
                <div className="avatar-wrap" ref={avatarRef} role="button" tabIndex={0} aria-haspopup="true" aria-expanded={menuOpen} onClick={()=>setMenuOpen(s=>!s)} onKeyDown={(e)=>{ if (e.key==='Enter' || e.key===' ') { e.preventDefault(); setMenuOpen(s=>!s) } }}>
                    {avatar ? (
                        <img src={avatar} alt={`${name || username} avatar`} className="avatar-img" />
                    ) : (
                        <div className="avatar-fallback">{getInitials()}</div>
                    )}
                    {menuOpen && (
                        <div className="avatar-menu" ref={menuRef} role="menu" aria-label="User menu">
                            <button className="avatar-menu-item logout" role="menuitem" onClick={doLogout}>Log out</button>
                        </div>
                    )}
                </div>
                <div className="profile-meta">
                    <div className="profile-name">{name || `${firstName} ${lastName}` || username}</div>
                    <div className="profile-username">@{username}</div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="profile-stats">
                <div className="xp-block">
                    <div className="xp-label">Total XP</div>
                    <div className="xp-value">{xp.toLocaleString()}</div>
                    <div className="xp-bar">
                        <div className="xp-fill" style={{ width: `${xpPercent}%` }} />
                    </div>
                </div>
                <div className="streak-block">
                    <div className="streak-label">Current Streak</div>
                    <div className={`streak-value ${bump ? 'streak-bump' : ''}`}>{streak} Days</div>
                </div>
                <div className="best-streak-block">
                    <div className="streak-label">Longest Streak</div>
                    <div className="streak-value">{(Number(longestStreak) || 0)} Days</div>
                </div>
                </div>
            </div>
        </header>
    )
}

export default UserSection

function LogoutButton(){
    const navigate = useNavigate()
    const handle = ()=>{
        try{
            localStorage.removeItem('userProfile')
            localStorage.removeItem('userLoggedIn')
            try{ localStorage.removeItem('userInterests') }catch(e){}
            try{ window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: null })) }catch(e){}
        }catch(e){ console.error('logout failed', e) }
        navigate('/login')
    }

    return (
        <button className="logout-btn" onClick={handle} aria-label="Log out">Log out</button>
    )
}
