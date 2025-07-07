import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

export default function LoginPage() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const navigate              = useNavigate()
  const { login }             = useContext(AuthContext)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) throw new Error(await res.text())
      const { token, user } = await res.json()
      login(token, user)
      // Redirect based on role:
      if (user.role === 'manufacturer') navigate('/manufacturer')
      else navigate('/customer')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ padding:'2rem', maxWidth:400, margin:'auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email" value={email} onChange={e=>setEmail(e.target.value)}
          placeholder="Email" required
          style={{ display:'block', width:'100%', marginBottom:8 }}
        />
        <input
          type="password" value={password} onChange={e=>setPassword(e.target.value)}
          placeholder="Password" required
          style={{ display:'block', width:'100%', marginBottom:8 }}
        />
        {error && <p style={{color:'red'}}>{error}</p>}
        <button type="submit">Log In</button>
      </form>
    </div>
  )
}
