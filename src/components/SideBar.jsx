import React from "react"
import "./SideBar.css"

function SideBar({ user = {} }) {
    const { name = 'Jordan Smith', level = 'Level 12 Scholar', xp = 1500, xpGoal = 2000, streak = 15, posts = 42 } = user
    const progress = Math.round((xp / xpGoal) * 100)

    return (
        <aside className="side-bar">
            <div className="profile-card">
                <div className="profile-name"> { name }</div>
                <div className="profile-level"> { level }</div>

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
                        <div className="stat-value">🔥 {streak} Days</div>
                    </div>
                    <div className="stat">
                        <div className="stat-label">Posts Created</div>
                        <div className="stat-value">✍️ {posts}</div>
                    </div>
                </div>

                <div className="quick-links">
                    <button className="link-btn">My Notes</button>
                    <button className="link-btn">My Badges</button>
                    <button className="link-btn">Saved Posts</button>
                </div>
            </div>

        </aside>
    )
}

export default SideBar
