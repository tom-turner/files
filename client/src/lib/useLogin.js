import { useState, useEffect, useCallback } from "react"
import { session } from "./api"

export function useToken() {
  let [token, setToken] = useState(window.localStorage.getItem('token'))

  useEffect(() => {
    if (token !== null) {
      window.localStorage.setItem('token', token)
    } else {
      window.localStorage.removeItem('token')
    }
  }, [token])

  const revokeToken = () => setToken(null)

  return { token, setToken, revokeToken }
}

export function useLogin() {
  const { token, setToken, revokeToken } = useToken()
  const [error, setError] = useState(null)

  const handleResponse = useCallback((res) => {
    if (res.error) {
      setError(res.error)
      revokeToken()
    } else {
      setError(null)
      setToken(res.token)
    }
  }, [])

  const loggedIn = !!token
  const logout = revokeToken
  const login = (username, password) => {
    return session({ username, password })
      .then(handleResponse)
      .catch(e => setError(e))
  }

  return { loggedIn, error, login, logout }
}
