import { useState } from "react"

export default function useToken() {
  let [token, setToken] = useState(null)

  useEffect(() => {
    setToken(window.localStorage.getItem('token'))
  }, [])

  const revokeToken = () => {
    setToken(null)
  }

  return { token, revokeToken }
}



