import React, { createContext, useState, useEffect } from 'react'

// 1. Create the context
export const AuthContext = createContext()

// 2. Provider component
export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Persist token → localStorage, clear on logout
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token])

  // Call this after successful login/register
  const login = (token, userData) => {
    setToken(token)
    setUser(userData)
  }
  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
