import { useState, useEffect } from "react";
import { createDir } from '../../lib/api'

let CreateDirectory = (props) => {
	const [fileName, setFileName] = useState('')
	let handleKeyDown = (event) => {
    	if(event.keyCode === 13) { createDir(fileName) }
	}

	return (
		<div className="flex w-full h-full rounded overflow-hidden ">
			<input type="text" className="w-full h-full bg-gray-200 text-center text-2xl" placeholder="Create Folder" onChange={ (event) => {
				setFileName(event.target.value)
			}} onKeyDown={handleKeyDown} />
		</div>
	)
}


export default CreateDirectory;