import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Feed from './pages/Feed.jsx'
import NewPost from './pages/NewPost.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import SignupTags from './pages/SignupTags.jsx'
import AppShell from './components/AppShell.jsx'
import './App.css'

const initialPosts = [
  {
    id: 1,
    author: 'Maria Garcia',
    title: 'The Basics of Quantum Computing',
    content:
      "Just dove into the fascinating world of quantum computing! It's mind-bending, but the core idea of qubits being in superpositions of 0 and 1 is simultaneously the challenge and the power.",
    tags: ['Quantum', 'Physics'],
    likes: 128,
    comments: 23,
    time: '2 hours ago',
  },
  {
    id: 2,
    author: 'David Chen',
    title: 'Stoicism in Modern Life',
    content:
      'Exploring how ancient Stoic philosophy can be applied today. Highly recommend reading Seneca!',
    tags: ['Philosophy', 'Wellbeing'],
    likes: 97,
    comments: 15,
    time: '5 hours ago',
  },
]

function App() {
  const [posts, setPosts] = useState(() => {
    try {
      const raw = localStorage.getItem('posts')
      return raw ? JSON.parse(raw) : initialPosts
    } catch (e) {
      return initialPosts
    }
  })

  function handleCreatePost(post) {
    // give it an id and defaults
    // prefer to set the author to the logged-in user's username or name when available
    let author = post.author || 'You'
    try{
      const rawUser = localStorage.getItem('userProfile')
      if (rawUser){
        const u = JSON.parse(rawUser)
        author = u.username || u.name || author
      }
    }catch(e){}

    const newPost = {
      id: Date.now(),
      author,
      title: post.title,
      content: post.content,
      tags: post.tags || [],
      likes: 0,
      comments: [],
      time: 'just now',
    }
    console.debug('[App] handleCreatePost:', { post })
    setPosts((p) => {
      const updated = [newPost, ...p]
      try{ 
        localStorage.setItem('posts', JSON.stringify(updated))
        try { window.dispatchEvent(new CustomEvent('postsUpdated', { detail: updated })) } catch(e){}
      }catch(e){}

      // award XP to the logged-in user for creating a post
      try {
        const rawUser = localStorage.getItem('userProfile')
        if (rawUser) {
          const u = JSON.parse(rawUser)
          const currentXp = Number(u.xp || 0)
          u.xp = currentXp + 50 // +50 XP for creating a post
          try { 
            localStorage.setItem('userProfile', JSON.stringify(u))
            console.debug('[App] Updated userProfile XP ->', u.xp)
            // notify other components in the same tab that the profile changed
            try { window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: u })) } catch(e){ console.error('dispatch userProfileUpdated failed', e) }
          } catch (e) { console.error('persist userProfile failed', e) }
        } else {
          console.debug('[App] no userProfile found in localStorage when awarding XP')
        }
      } catch (e) { console.error('error awarding xp', e) }

      return updated
    })
  }

  return (
    <>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            {/* tailor feed if user has selected interests during signup */}
            <Route
              path="/home"
              element={<Feed posts={(() => {
                try {
                  const raw = localStorage.getItem('userInterests')
                  const rawUser = localStorage.getItem('userProfile')
                  const user = rawUser ? JSON.parse(rawUser) : null
                  const usernameLower = user && user.username ? user.username.toLowerCase() : null
                  const nameLower = user && user.name ? user.name.toLowerCase() : null

                  if (raw) {
                    const interests = JSON.parse(raw)
                    if (Array.isArray(interests) && interests.length > 0) {
                      return posts.filter(p => {
                        const matchesTags = p.tags && p.tags.some(t => interests.includes(t))
                        const author = (p.author || '').toLowerCase()
                        const isAuthor = (usernameLower && author === usernameLower) || (nameLower && author === nameLower) || author === 'you'
                        return matchesTags || isAuthor
                      })
                    }
                  }
                } catch (e) {}
                return posts
              })()} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/tags" element={<SignupTags />} />
            <Route path="/new-post" element={<NewPost onCreate={handleCreatePost} />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </>
  )
}

export default App
