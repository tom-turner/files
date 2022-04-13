import { useState, useEffect } from "react";

let uploadFile = (file) => {
    fetch("/uploadFile", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      	fileName: file.name,
      	path: window.location.pathname,
      	fileType: file.type
      })
    })
    .then((res) => res.json())
    .then((data) => { return window.location.reload() })
    .catch((error) => { return alert(`error: ${error}`) })
}

let FileUploadButton = (props) => {

	const [file, setFile] = useState(null)

	return (
		<div className="">
			<lable> Upload: </lable>
			<input type="file" className="" onChange={ (event) => {
				setFile(event.target.files[0])
				uploadFile(event.target.files[0])
				
			}} />
		</div>
	)
}

let FileUpload = () => {
	return (
		<div>
			<FileUploadButton className="" />
		</div>
	)
}

export default FileUpload;