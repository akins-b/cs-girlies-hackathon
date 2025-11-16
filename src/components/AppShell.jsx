import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import NavBar from './NavBar'
import SideBar from './SideBar'
import './AppShell.css'

function AppShell({ children }) {
    const location = useLocation()
    const showSidebar = location && location.pathname && location.pathname.startsWith('/home')
    const showNavBar = location && location.pathname && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/signup')

    const [user, setUser] = useState(()=>{
        try{
            const raw = localStorage.getItem('userProfile')
            return raw ? JSON.parse(raw) : null
        }catch(e){ return null }
    })

    useEffect(()=>{
        const onStorage = (e)=>{
            if (e.key === 'userProfile'){
                try{ setUser(e.newValue ? JSON.parse(e.newValue) : null) }catch(err){ setUser(null) }
            }
        }
        window.addEventListener('storage', onStorage)
        // same-tab updates (storage events don't fire in the same tab)
        const onProfileUpdated = (e) => {
            try{
                const u = e && e.detail ? e.detail : null
                if (u) setUser(u)
                else {
                    const raw = localStorage.getItem('userProfile')
                    setUser(raw ? JSON.parse(raw) : null)
                }
            }catch(err){ setUser(null) }
        }
        window.addEventListener('userProfileUpdated', onProfileUpdated)
        return ()=>{
            window.removeEventListener('storage', onStorage)
            window.removeEventListener('userProfileUpdated', onProfileUpdated)
        }
    }, [])

    // Also refresh the user state when location changes (storage events don't fire
    // in the same tab that wrote to localStorage). This ensures NavBar/SideBar
    // immediately reflect the signed-in user after login/signup navigation.
    useEffect(()=>{
        try{
            const raw = localStorage.getItem('userProfile')
            setUser(raw ? JSON.parse(raw) : null)
        }catch(e){ setUser(null) }
    }, [location && location.pathname])

    return (
        <div className="app-shell-root">
            {showNavBar && <NavBar user={user} />}
            <div className="app-shell-grid">
                {showSidebar && <SideBar user={user} />}
                <main className="app-shell-main">{children}</main>
            </div>
        </div>
    )
}

export default AppShell