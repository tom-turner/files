import { useState, useEffect } from "react";
import { uploadFile, uploadFiles } from "../../lib/api"

let ProgressBar = ({progress, hidden}) => {
	return (
		<div className={"w-full bg-gray-200 m-2 mx-auto rounded-full overflow-hidden "+hidden}> 
			<div className="w-0 h-2 bg-green-600" style={{width: progress+"%"}}>  </div>
		</div>
	)
}


let FileUploadButton = (props) => {
	const [ progress, setProgress ] = useState(0)
	const [ hidden, setHidden ] = useState('hidden')


	let handleFileUpload = (event, callback) =>{
		uploadFiles(event.target.files, (e) => {
			if(e.error){
				alert(e.error.message)
				window.location.reload()
			}
			if(e.success){
				window.location.reload()
			}
			setProgress(e.progress)
			setHidden('')
		})
	}

	return (
		<div className="">
			<lable> Upload: </lable>
			<input type="file" className="" onChange={handleFileUpload} />
			<ProgressBar progress={progress} hidden={hidden} />
			<p className={hidden} > {progress}% done </p>
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