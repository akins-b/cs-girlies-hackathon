import React from "react"
import './UserSection.css'

function UserSection({ user = {} }) {
    const {
        name = 'Alex Doe',
        username = 'alexdoe',
        avatar = '',
        xp = 15420,
        xpGoal = 20000,
        streak = 45,
    } = user

    const xpPercent = Math.round((xp / xpGoal) * 100)

    return (
        <header className="profile-header">
            <div className="profile-left">
                <div className="avatar-wrap">
                    {avatar ? (
                        <img src={avatar} alt={`${name} avatar`} className="avatar-img" />
                    ) : (
                        <div className="avatar-fallback">{name.split(' ').map(n => n[0]).slice(0,2).join('')}</div>
                    )}
                </div>
                <div className="profile-meta">
                    <div className="profile-name">{name}</div>
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