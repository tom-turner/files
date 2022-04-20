import { useLogin } from "./useLogin"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function withAuthentication(Component) {
  return (props) => {
    const { loggedIn } = useLogin()
    const navigate = useNavigate()

    useEffect(() => {
      if (!loggedIn) {
        navigate('/login')
      }
    }, [loggedIn])

    return <Component {...props} />
  }
}
