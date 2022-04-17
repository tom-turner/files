import { useState, useEffect } from "react";
import { serverCheck } from '../lib/api'

let ServerOkMsg = (data) => {
  let [ className, setClassName ] = useState('')

  setTimeout(() =>{
    setClassName('translate-y-full')
  }, 3500) 

  return (
    <div className={"absolute bottom-0 w-full bg-green-400 p-2 duration-300 " + className}>
      <p className="text-white text-lg"> Server OK :) </p>
    </div>
  )
}

let ServerErrorMsg = (error) => {
  let [ className, setClassName ] = useState('')

  return (
    <div className={"absolute bottom-0 w-full bg-red-400 p-2 duration-300 " + className}>
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