import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFileData, getFileContent } from '../lib/api'
import ServerCheck from "../components/ServerCheck"

let FilePreview = () => {
	const params = useParams()
	const fileId = params['*']
	const [ fileData, setFileData ] = useState({})

	useEffect( () => {
		;(async () => {
	    let fileData = await getFileData(fileId)
	    setFileData(fileData)
		})()
	},[fileId])

	useEffect( () => {
		;(async () => {
	    let fileContent = await getFileContent(fileId)
	    // do something with fileContent
		})()
	},[fileId])

	return (
		<div>
			<ServerCheck />
			<p> {fileData.user_file_name} </p>
		</div>
		)
}

export default FilePreview