import React, { useContext } from 'react'
import { AuthContext }      from './AuthContext'
import { Navigate }         from 'react-router-dom'

export default function PrivateRoute({ children, role }) {
  const { user } = useContext(AuthContext)
  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />
  }
  if (role && user.role !== role) {
    // Wrong role
    return <Navigate to="/" replace />
  }
  return children
}
