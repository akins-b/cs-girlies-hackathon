import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Signup.css'

function Signup(){
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleNext = (e)=>{
    e.preventDefault()
    setError('')
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password) {
      setError('Please fill all fields to continue')
      return
    }

    const formData = { firstName, lastName, username, email }
    // pass password too for mock registration (in real app handle securely)
    navigate('/signup/tags', { state: { formData, password } })
  }

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleNext}>
        <h2>Create your account</h2>

        <div className="row">
          <div className="col">
            <label htmlFor="firstName">First name</label>
            <input id="firstName" value={firstName} onChange={e=>setFirstName(e.target.value)} />
          </div>
          <div className="col">
            <label htmlFor="lastName">Last name</label>
            <input id="lastName" value={lastName} onChange={e=>setLastName(e.target.value)} />
          </div>
        </div>

        <label htmlFor="username">Username</label>
        <input id="username" value={username} onChange={e=>setUsername(e.target.value)} />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />

        {error && <div className="signup-error">{error}</div>}

        <div className="actions">
          <button type="submit" className="next-btn">Next</button>
        </div>
      </form>
    </div>
  )
}

export default Signup
