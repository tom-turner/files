import { useState, useEffect, useContext } from "react";
import { getUserById } from "../lib/api"
import { AuthenticationContext } from "../context/withAuthentication"
import { useNavigate } from "react-router-dom";
import { Loading } from '../components/Alerts'
import { ReactComponent as Avatar }  from '../assets/avatar.svg';

export function MyAccount() {
  const { logout } = useContext(AuthenticationContext)
  let [ user, setUser ] = useState([])

  useEffect( () => {
    ( async () => {
      setUser( await getUserById() )
    } )()
  },[])

  return (
    <div className="flex flex-col flex-grow bg-stone-800 text-white p-6 space-y-6 items-center">

      <div onClick={ () => { } } className="w-64 h-64 relative rounded-full mx-auto group overflow-hidden hover:border cursor-pointer">
        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-2xl invisible group-hover:visible"> Edit </p>
        <div className="w-full h-full bg-stone-900 group-hover:opacity-10">
          <Avatar className="p-12 fill-white" />
        </div>
      </div>

      <button onClick={logout} className="rounded-full px-6 py-3 hover:bg-indigo-500 bg-stone-900 font-bold text-xl">Logout</button>

    </div>
  )
}