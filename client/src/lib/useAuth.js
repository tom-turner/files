import { useState } from "react"

export function useToken() {
  let [token, setToken] = useState(null)

  useEffect(() => {
    setToken(window.localStorage.getItem('token'))
  }, [])

  return { token }
}

export const useLogin = () => {
  const { token, setToken, revokeToken } = useAuth()
  const [error, setError] = useState(null)

  const loggedIn = !!token
  const logout = revokeToken
  const login = (email: string, password: string) => {
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(res => res.json())
      .then(res => {
        // ensure batching of state updates. we could move this into the
        // same reducer by collapsing the useAuth hook into this hook if
        // we think that is preferable.
        useCallback(() => {
          if (res.error) {
            setError(res.error)
            revokeToken()
          } else {
            setError(null)
            setToken(res.token)
          }
        }, [])
      })
      .catch(e => setError(e))
  }

  return { loggedIn, error, login, logout }
}
