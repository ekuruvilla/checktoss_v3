import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export default function useAuthFetch() {
  const { token } = useContext(AuthContext)
  return (url, opts = {}) => {
    const headers = {
      ...opts.headers,
      Authorization: token ? `Bearer ${token}` : undefined
    }
    return fetch(url, { ...opts, headers })
  }
}
