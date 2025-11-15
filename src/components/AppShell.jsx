import React from 'react'
import { useLocation } from 'react-router-dom'
import NavBar from './NavBar'
import SideBar from './SideBar'
import './AppShell.css'

function AppShell({ children }) {
    const location = useLocation()
    const showSidebar = location && location.pathname && location.pathname.startsWith('/home')

    return (
        <div className="app-shell-root">
            <NavBar />
            <div className="app-shell-grid">
                {showSidebar && <SideBar />}
                <main className="app-shell-main">{children}</main>
            </div>
        </div>
    )
}

export default AppShell