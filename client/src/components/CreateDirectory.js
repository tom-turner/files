import { useState, useEffect } from "react";

let createDir = (fileName) => {
    fetch("/createDir", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      	fileName: fileName,
      	path: window.location.pathname,
      })
    })
    .then((res) => res.json())
    .then((data) => { return window.location.reload() })
    .catch((error) => { return alert(`error: ${error}`) })
}



let CreateDirButton = (props) => {
	const [fileName, setFileName] = useState('')

	let handleKeyDown = (event) => {
    if(event.keyCode === 13) { 
        createDir(fileName)
  	}
	}

	return (
		<div className="flex w-full h-full rounded overflow-hidden ">
			<input type="text" className="w-full h-full bg-gray-200 text-center text-2xl" placeholder="Create Folder" onChange={ (event) => {
				setFileName(event.target.value)
			}} onKeyDown={handleKeyDown} />
		</div>
	)
}

let CreateDirectory = () => {
	return (
		<div>
			<CreateDirButton className="" />
		</div>
	)
}


export default CreateDirectory;