import { useState, useEffect } from "react";
import { serverCheck } from '../lib/api'

let ServerOkMsg = (data) => {
  let [ className, setClassName ] = useState('')

  setTimeout(() =>{
    setClassName('translate-y-full')
  }, 1000) 

  return (
    <div className={"z-50 absolute bottom-0 w-full duration-300 p-3 " + className}>
      <p className="bg-green-500 rounded-lg p-2 text-center mx-auto text-white text-lg"> Server OK </p>
    </div>
  )
}

let ServerErrorMsg = (error) => {
  let [ className, setClassName ] = useState('')

  return (
    <div className={"z-50 absolute bottom-0 w-full duration-300 p-3" + className}>
      <p className="bg-red-400 rounded-lg p-2 text-center mx-auto text-white text-lg"> Error Connecting To Server </p>
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