import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

let FileViewer = () => {
	const params = useParams()
	const fileId = params['*']
	const [ file, setFile ] = useState({})

	useEffect( () => {
	    ;(async () => {
	      const result = await fetch("/getFile", {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify({ id: fileId })
	      });
	      let body = await result.json()
	      setFile(body.fileData)
	    })()
	}, [fileId]);


	return <p> {file.user_file_name} </p>
}

export default FileViewer