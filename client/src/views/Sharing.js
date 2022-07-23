import { getFilesByTag, getTagById, getSharedTagsByUser } from "../lib/api"
import { useState, useEffect } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { Files } from '../components/Files'
import { TagBar } from '../components/Tags'
import { Loading } from '../components/Alerts'

export function Sharing() {
  let [ tags, setTags ] = useState([])

  useEffect( () => {
    ( async () => {
      setTags( await getSharedTagsByUser() )
    } )()
  },[])

  return (
    <div className="flex flex-grow bg-stone-800">
      <TagBar tags={tags} />
      <Outlet />
    </div>
  )
}