import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Feed from './pages/Feed.jsx'
import NewPost from './pages/NewPost.jsx'
import Profile from './pages/Profile.jsx'
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
  const [posts, setPosts] = useState(initialPosts)

  function handleCreatePost(post) {
    // give it an id and defaults
    const newPost = {
      id: Date.now(),
      author: post.author || 'You',
      title: post.title,
      content: post.content,
      tags: post.tags || [],
      likes: 0,
      comments: 0,
      time: 'just now',
    }
    setPosts((p) => [newPost, ...p])
  }

  return (
    <>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Feed posts={posts} />} />
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
