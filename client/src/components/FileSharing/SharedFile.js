import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { getSharedFile } from "../../lib/api"

let HandleExplorer = ({slug, file }) => {
	return (
		<p>{ JSON.stringify(file) }</p>
	)
}

let Share = () => {
	const params = useParams()
	const slug = params['slug']
	const id = params['fileId']
	const [ file, setFile ] = useState(null)
	const getFile = async () => {
		let result = await getSharedFile(slug, id)
		setFile(result.file)
	}

	useEffect(() => { getFile() } ,[slug])

	return (
		<HandleExplorer slug={slug} file={file}  />
	)
}


export default Share;