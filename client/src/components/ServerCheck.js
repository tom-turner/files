import { useState, useEffect } from "react";
import { serverCheck } from '../lib/api'

let ServerMsg = (props) => {
  return (
    <div className={"z-50 w-full duration-300 p-3 " }>
      <p className={`rounded-lg p-2 text-center mx-auto text-white text-lg ${props.className}`}> {props.message} </p>
    </div>
  )
}

let ServerCheck = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    serverCheck((response) => {
      if (response.error){
        setError(response.error)
      } else {
        setData(response.message)
      }
    })
  }, []);

  if(error){
    return <ServerMsg className="bg-red-500" message={`Error Connecting To Server - ${error}`} />
  } else {
    return <ServerMsg className="bg-green-500" message={`${data}`} />
  }
}

export default ServerCheck;