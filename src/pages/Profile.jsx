import React from 'react'
import UserSection from '../components/UserSection.jsx'
import ProfileTabs from '../components/ProfileTabs.jsx'

function Profile(){
    const user = {
        name: 'Jordan Smith',
        username: 'jordansmith',
        avatar: '',
        xp: 15420,
        xpGoal: 20000,
        streak: 45,
    }

    // sample posts for the tabs (would come from app state or API)
    const samplePosts = [
        { id: 101, title: 'Understanding React Hooks', content: 'A deep dive into useState and useEffect...' },
        { id: 102, title: 'Getting Started with Pandas', content: 'An intro to dataframes and common operations...' },
    ]

    return (
        <div>
            <UserSection user={user} />
            <ProfileTabs posts={samplePosts} />
        </div>
    )
}

export default Profile