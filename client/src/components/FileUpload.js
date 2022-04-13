import { useState, useEffect } from "react";
import { uploadFile } from "../lib/fileUploader"

let ProgressBar = ({progress, hidden}) => {
	return (
		<div className={"w-full bg-gray-200 m-2 "+hidden}> 
			<div className="w-0 h-2 bg-green-600" style={{width: progress+"%"}}>  </div>
		</div>
	)
}

let FileUploadButton = (props) => {
	const [ progress, setProgress ] = useState(0)
	const [ hidden, setHidden ] = useState('hidden')

	return (
		<div className="">
			<lable> Upload: </lable>
			<input type="file" className="" onChange={ (event) => {
				uploadFile(event.target.files[0], (progress) => {
					console.log(progress)
					setProgress(progress)
					setHidden('')
				})
			}} />
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