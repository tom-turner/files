import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFileData, getFileContent } from '../lib/api'
import ServerCheck from "../components/ServerCheck"

let FilePreview = () => {
	const params = useParams()
	const fileId = params['*']
	const [ fileData, setFileData ] = useState({})
	const [ fileContent, setFileContent ] = useState({})

	useEffect( () => {
		;(async () => {
	    let fileData = await getFileData(fileId)
	    setFileData(fileData)
		})()
	},[fileId])

	useEffect( () => {
		;(async () => {
	    let fileContent = await getFileContent(fileId)
	   	setFileContent(fileContent)
	   	console.log(fileContent)
		})()
	},[fileId])

	return (
		<div>
			<p> {fileData.user_file_name} </p>
			<img className="max-h-screen" src={fileContent.url} />
		</div>
		)
}

export default FilePreview