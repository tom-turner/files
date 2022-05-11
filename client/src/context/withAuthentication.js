import { useLogin } from "../lib/useLogin"
import { useNavigate } from "react-router-dom"
import { useEffect, createContext } from "react"

export const AuthenticationContext = createContext({})

export function withAuthentication(Component) {
  return (props) => {
    const { loggedIn, logout } = useLogin()
    const navigate = useNavigate()

    useEffect(() => {
      if (!loggedIn) {
        navigate('/login')
      }
    }, [loggedIn])

    return <AuthenticationContext.Provider value={{ loggedIn, logout }}>
      <Component {...props} />
    </AuthenticationContext.Provider>
  }
}
