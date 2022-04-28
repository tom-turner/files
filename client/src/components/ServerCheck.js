import { useState, useEffect, useContext } from "react";
import { serverCheck } from '../lib/api'

let ServerOkMsg = ({data}) => {
  let [ className, setClassName ] = useState('')

  return (
    <div className={"z-50 w-full duration-300 p-3 " + className}>
      <p className="bg-green-500 rounded-lg p-2 text-center mx-auto text-white text-lg"> Server OK </p>
    </div>
  )
}

let ServerErrorMsg = ({error}) => {
  let [ className, setClassName ] = useState('')

  return (
    <div className={"z-50 w-full duration-300 p-3" + className}>
      <p className="bg-red-400 rounded-lg p-2 text-center mx-auto text-white text-lg">{ `Error Connecting To Server - ${error}` }</p>
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
        alert(response.error)
      } else {
        setData(response.data)
      }
    })
  }, []);

  if(error){
    return <ServerErrorMsg error={error} />
  } else {
    return <ServerOkMsg data={data} />
  }
}

export default ServerCheck;