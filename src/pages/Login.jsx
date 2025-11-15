import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const validate = ()=>{
    if (!username.trim() || !password) {
      setError('Please enter both username and password.')
      return false
    }
    return true
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    // simulate async login
    setTimeout(()=>{
      setLoading(false)
      // simple mock: accept any credentials
      navigate('/home')
    }, 900)
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit} aria-live="polite">
        <h2>Sign in</h2>

        <label htmlFor="username">Username</label>
        <input id="username" type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="your username" autoComplete="username" />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="your password" autoComplete="current-password" />

        {error && <div className="login-error" role="alert">{error}</div>}

        <button className="signin-btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>

        <div className="login-footer">
          <span>New here? <Link to="/signup">Create an account</Link></span>
        </div>
      </form>
    </div>
  )
}

export default Login
