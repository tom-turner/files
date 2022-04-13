import { useState, useEffect } from "react";

let ServerOkMsg = (data) => {
  return (
    <div className="w-full bg-green-400 p-2">
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

    fetch("/servercheck", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message:'hello server'})
    })
    .then((res) => res.json())
    .then((data) => { setData(data) })
    .catch((error) => { setError(error) })
  }, []);

  if(!error){
    return <ServerOkMsg data={data} />
  } else {
    return <ServerErrorMsg data={error} />
  }
}

export default ServerCheck;