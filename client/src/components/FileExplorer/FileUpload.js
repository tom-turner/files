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

	return (
		<div className="">
			<lable> Upload: </lable>
			<input type="file" className="" onChange={ (event) => {
				uploadFiles(event.target.files, (progress) => {
					setProgress(progress)
					setHidden('')
				})
			}} multiple />
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