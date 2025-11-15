import React from 'react'
import NavBar from './NavBar'
import SideBar from './SideBar'
import './AppShell.css'

function AppShell({ children }) {
    return (
        <div className="app-shell-root">
            <NavBar />
            <div className="app-shell-grid">
                <SideBar />
                <main className="app-shell-main">{children}</main>
            </div>
        </div>
    )
}

export default AppShell