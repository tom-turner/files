import { useState, useEffect } from "react";
import { serverCheck } from '../lib/api'

let ServerOkMsg = (data) => {
  let [ className, setClassName ] = useState('')

  setTimeout(() =>{
    setClassName('hidden')
  }, 1500) 

  return (
    <div className={"w-full bg-green-400 p-2 " + className}>
      <p className="text-white text-lg"> Server OK :) </p>
    </div>
  )
}

let ServerErrorMsg = (error) => {
  return (
    <div className="w-full bg-red-400 p-2">
      <p className="text-white text-lg"> Error Connecting To Server </p>
    </div>
  )
}

let ServerCheck = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    serverCheck((response) => {
      setData(response.data)
      setError(response.error)
    })
  }, []);

  if(!error){
    return <ServerOkMsg data={data} />
  } else {
    return <ServerErrorMsg data={error} />
  }
}

export default ServerCheck;