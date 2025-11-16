import React from "react";
import { Link } from "react-router-dom";
import './NavBar.css';

function NavBar({ user }) {
    const getInitials = () => {
        if (!user) return 'JS'
        const { firstName = '', lastName = '', name = '', username = '' } = user
        if (firstName || lastName) {
            const a = firstName ? firstName.trim()[0] : (name ? name.trim().split(' ')[0][0] : (username ? username[0] : 'J'))
            const b = lastName ? lastName.trim()[0] : (firstName && firstName.trim().split(' ')[1] ? firstName.trim().split(' ')[1][0] : (name && name.trim().split(' ')[1] ? name.trim().split(' ')[1][0] : 'S'))
            return ((a||'') + (b||'')).toUpperCase()
        }
        if (name) return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()
        if (username) return username.slice(0,2).toUpperCase()
        return 'JS'
    }
    const initials = getInitials()
    return (
        <header className="nav">
            <div className="nav-left">
                <Link to='/home' className="brand">LearnSpace</Link>
                
            </div>

            <div className="nav-center">
                <label htmlFor="nav-search-input" className="visually-hidden">Search</label>
                <input id='nav-search-input' className="nav-search" placeholder="Search topics, entries..." aria-label="Search" />
            </div>
            
            <div className="nav-right">
                <Link to='/new-post' className="new-post" aria-label="Create new entry">New Entry</Link>

                <Link to='/profile' className="avatar" aria-label='Your profile'>{initials}</Link>
                
            </div>
        </header>
    )
}

export default NavBar