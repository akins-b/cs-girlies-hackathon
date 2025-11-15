import React, { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Signup.css'

const AVAILABLE_TAGS = [
  'React', 'JavaScript', 'Python', 'Data Science', 'Machine Learning', 'CSS', 'UX', 'DevOps', 'Blockchain', 'Databases', 'Cloud', 'Security', 'Design', 'Product', 'Algorithms'
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
    const user = { ...formData, interests: selected }
    try{
      localStorage.setItem('userProfile', JSON.stringify(user))
      localStorage.setItem('userInterests', JSON.stringify(selected))
      localStorage.setItem('userLoggedIn', 'true')
    }catch(e){/* ignore */}
    // navigate to home where feed will be tailored by localStorage interests
    navigate('/home')
  }

  const handleSkip = (e)=>{
    e && e.preventDefault()
    // save minimal profile (without interests) and continue
    try{
      const user = formData ? { ...formData, interests: [] } : { username: 'guest', interests: [] }
      localStorage.setItem('userProfile', JSON.stringify(user))
      localStorage.setItem('userInterests', JSON.stringify([]))
      localStorage.setItem('userLoggedIn', 'true')
    }catch(e){}
    navigate('/home')
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
