import { useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";

export function OldPublicUrl() {
  let params = useParams()['*']
  let navigate = useNavigate()

  useEffect(() => {
    navigate(`/public/${params}`)
  },[])
}