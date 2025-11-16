import React from "react"
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
    } = user

    const xpPercent = Math.round((xp / xpGoal) * 100)

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

    return (
        <header className="profile-header">
            <div className="profile-left">
                <div className="avatar-wrap">
                    {avatar ? (
                        <img src={avatar} alt={`${name || username} avatar`} className="avatar-img" />
                    ) : (
                        <div className="avatar-fallback">{getInitials()}</div>
                    )}
                </div>
                <div className="profile-meta">
                    <div className="profile-name">{name || `${firstName} ${lastName}` || username}</div>
                    <div className="profile-username">@{username}</div>
                </div>
            </div>

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
                    <div className="streak-value">{streak} Days</div>
                </div>
            </div>
        </header>
    )
}

export default UserSection