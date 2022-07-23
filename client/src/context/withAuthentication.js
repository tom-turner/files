import { useLogin } from "../lib/useLogin"
import { useNavigate } from "react-router-dom"
import {createContext, useEffect } from "react";
import Navbar from '../components/Navbar'

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
      <div className="flex">
        { loggedIn && <Navbar /> }
        <Component {...props} />
      </div>
    </AuthenticationContext.Provider>
  }
}
