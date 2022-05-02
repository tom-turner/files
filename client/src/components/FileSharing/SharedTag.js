import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { getSharedFiles } from "../../lib/api"

let HandleExplorer = ({slug, files}) => {
	return (
		<p>{ JSON.stringify(files) }</p>
	)
}

let Share = () => {
	const params = useParams()
	const slug = params['slug']
	const [ files, setFiles ] = useState(null)
	const getFiles = async () => {
		let result = await getSharedFiles(slug)
		console.log(result)
		setFiles(result)
	}

	useEffect(() => { getFiles() } ,[slug])

	return (
		<HandleExplorer slug={slug} files={files} />
	)
}


export default Share;