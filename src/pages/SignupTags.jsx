import React, { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Signup.css'

const AVAILABLE_TAGS = [
  'React', 'JavaScript', 'TypeScript', 'Python', 'Django', 'Flask', 'Data Science', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
  'CSS', 'Sass', 'UX', 'UI', 'Accessibility', 'Design', 'Product', 'Algorithms', 'Data Engineering', 'Big Data', 'Databases', 'SQL', 'NoSQL',
  'DevOps', 'Kubernetes', 'Docker', 'Cloud', 'AWS', 'GCP', 'Azure', 'Security', 'Blockchain', 'Cryptography', 'Mobile', 'iOS', 'Android',
  'Testing', 'CI/CD', 'Performance', 'Analytics', 'Career', 'Entrepreneurship', 'Marketing'
]

function SignupTags(){
  const loc = useLocation()
  const navigate = useNavigate()
  const state = loc.state || {}
  const { formData, password } = state

  if (!formData){
    // if no form data, go back to signup
    navigate('/signup')
    return null
  }

  const [selected, setSelected] = useState([])

  const toggle = (tag)=>{
    if (selected.includes(tag)) setSelected(s=>s.filter(t=>t!==tag))
    else {
      if (selected.length >= 5) return
      setSelected(s=>[...s, tag])
    }
  }

  const canSubmit = selected.length > 0

  const handleSubmit = (e)=>{
    e.preventDefault()
    // persist mock user
  const user = { ...formData, interests: selected, xp: 0, xpGoal: 1000, streak: 0, longestStreak: 0, lastPostAt: null, savedPosts: [] }
    try{
      // save to per-username profiles so they can log in later
      const rawMap = localStorage.getItem('user_profiles')
      const map = rawMap ? JSON.parse(rawMap) : {}
      if (user && user.username) map[user.username] = user
      try{ localStorage.setItem('user_profiles', JSON.stringify(map)) }catch(e){}
      // persist interests (used to seed/tailor feed)
      localStorage.setItem('userInterests', JSON.stringify(selected))
      // seed posts for the chosen interests if there are no posts yet
      trySeedPostsForInterests(selected)
    }catch(e){/* ignore */}
    // after signup, redirect to login so user can sign in
    navigate('/login')
  }

  const handleSkip = (e)=>{
    e && e.preventDefault()
    // save minimal profile (without interests) and continue
    try{
  const user = formData ? { ...formData, interests: [], xp:0, xpGoal:1000, streak:0, longestStreak:0, lastPostAt:null, savedPosts:[], followers:[], following:[] } : { username: 'guest', interests: [], xp:0, xpGoal:1000, streak:0, longestStreak:0, lastPostAt:null, savedPosts:[], followers:[], following:[] }
      // save into per-username profiles so they can log in later
      const rawMap = localStorage.getItem('user_profiles')
      const map = rawMap ? JSON.parse(rawMap) : {}
      if (user && user.username) map[user.username] = user
      try{ localStorage.setItem('user_profiles', JSON.stringify(map)) }catch(e){}
      localStorage.setItem('userInterests', JSON.stringify([]))
      // seed some general starter posts if posts not present
      trySeedPostsForInterests([])
    }catch(e){}
    navigate('/login')
  }

  // helper: seed sample posts for given interests when posts are empty
  const trySeedPostsForInterests = (tags)=>{
    try{
      const raw = localStorage.getItem('posts')
      const existing = raw ? JSON.parse(raw) : []
      if (Array.isArray(existing) && existing.length > 0) return // don't overwrite existing posts

      const sampleAuthors = ['Maria Garcia','David Chen','Aisha Patel','Liam O\'Connor','Chen Wei']
      const sampleByTag = {
        'React': [{ title: 'React Hooks Deep Dive', content: 'Hooks changed how we author React components...', tags:['React','JavaScript'] }],
        'JavaScript': [{ title: 'Async Patterns in JS', content: 'Promises, async/await and cancellation...', tags:['JavaScript'] }],
        'Python': [{ title: 'Pythonic Idioms', content: 'List comprehensions, generators and context managers...', tags:['Python'] }],
        'Data Science': [{ title: 'Exploratory Data Analysis', content: 'Start with visualization and summary stats...', tags:['Data Science'] }],
        'Machine Learning': [{ title: 'Intro to ML Models', content: 'Understanding supervised vs unsupervised learning...', tags:['Machine Learning'] }],
        'CSS': [{ title: 'Modern CSS Layouts', content: 'Grid and Flexbox make layout easier...', tags:['CSS','Design'] }],
        'UX': [{ title: 'Design Thinking Basics', content: 'Empathize, Define, Ideate, Prototype, Test...', tags:['UX','Design'] }],
        'Cloud': [{ title: 'Getting started with Cloud', content: 'Cloud providers offer compute, storage and managed services...', tags:['Cloud'] }],
        'Security': [{ title: 'Intro to Cybersecurity', content: 'Fundamentals of securing systems and networks...', tags:['Security'] }],
      }

      // build a small list of posts based on tags (or fall back to some general ones)
      const chosen = new Set()
      if (Array.isArray(tags) && tags.length>0){
        tags.forEach(t=>{
          if (sampleByTag[t]) sampleByTag[t].forEach(s=>chosen.add(JSON.stringify(s)))
        })
      }
      if (chosen.size === 0){
        // fallbacks
        Object.values(sampleByTag).slice(0,4).forEach(arr=> arr.forEach(s=> chosen.add(JSON.stringify(s))))
      }

      const samples = Array.from(chosen).map((s, idx)=>{
        const obj = JSON.parse(s)
        return {
          id: Date.now() + idx,
          author: sampleAuthors[idx % sampleAuthors.length],
          title: obj.title,
          content: obj.content,
          tags: obj.tags || [],
          likes: 0,
          comments: [],
          time: '1 day ago'
        }
      })

      try{ localStorage.setItem('posts', JSON.stringify(samples)) }catch(e){}
    }catch(e){ console.error('seed posts failed', e) }
  }

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Choose your top topics (pick up to 5)</h2>

        <div style={{display:'flex', flexWrap:'wrap', gap:10, marginTop:12}}>
          {AVAILABLE_TAGS.map(tag=>{
            const active = selected.includes(tag)
            return (
              <button type="button" key={tag} onClick={()=>toggle(tag)} className={active? 'tag-chip active':'tag-chip'} style={{padding:'8px 12px', borderRadius:999, background: active? '#2b7cff':'rgba(255,255,255,0.02)', color: active? '#fff':'#cfe8ff', border:'none', cursor:'pointer'}}>
                {tag}
              </button>
            )
          })}
        </div>

        <div style={{marginTop:16, color:'#9fb4c8'}}>Selected: {selected.length} / 5</div>

        <div className="actions" style={{display:'flex', gap:10, justifyContent:'flex-end'}}>
          <button type="button" className="skip-btn" onClick={handleSkip}>Skip for now</button>
          <button type="submit" className="next-btn" disabled={!canSubmit}>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default SignupTags
