import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFileData, getFileContent, getSharedFileData, getSharedFileContent } from '../lib/api'
import { downloadFromUrl } from '../lib/download'
import { Loading, Error } from "./Alerts"
import ServerCheck from "../components/ServerCheck"
import IconByType from './IconByType'
import {ReactComponent as DownloadIcon}  from '../assets/download.svg';
let { getApiBase } = require('../lib/apiBase')

let Audio = ({fileData, url, className}) => {
	return (
		<audio controls  src={url} className={className}/>
	)	
}

let Video = ({fileData, url, className}) => {
	return (
		<video controls src={url} className={className}/>
	)
}

let Image = ({fileData, url, className}) => {
	return (
		<object data={url} type={fileData.file_type} className={className}>
  		<img src={url}/>
		</object>	
	)
}

let Default = ({fileData, url, className}) => {
	return ( <IconByType fileType={fileData.file_type || '' } className={className} />
	)
}

let ContentPreview = ({fileData, url, className}) => {
	let fileType = fileData.file_type ? fileData.file_type.split('/')[0] : {}

	switch(fileType){
		case 'audio':
			return <Audio fileData={fileData} url={url} className={className} />
			break;
		case 'video':
			return <Video fileData={fileData} url={url} className={className} />
			break;
		case 'image':
			return <Image fileData={fileData} url={url} className={className}/>
			break;
		default:
			return <Default fileData={fileData} url={url} className={className}/>
	}

}

export function PageLayout({fileData, fileContentUrl}) {
	const navigate = useNavigate();

	if (fileData === null || fileData === undefined)
    return <Loading />

  if (fileContentUrl === null || fileContentUrl === undefined)
    return <Loading />

	return (
		<div className="bg-black bg-opacity-80 relative w-full relative min-h-screen overflow-scroll mx-auto flex flex-col justify-center space-y-3">
			
			<p onClick={ ()=>{ navigate(-1) } } className="absolute w-full h-screen cursor-pointer inset-0 text-right text-white px-6 py-2 font-bold text-2xl">x</p>
			
			<div className="absolute top-0 left-1/3 z-0 h-screen rounded-full animate-[spin_8s_linear_infinite] w-96 bg-green-400 blur-3xl"> </div>
      <div className="absolute top-0 right-1/3 z-0 h-screen rounded-full animate-[spin_20s_linear_infinite] w-96 bg-indigo-400 blur-3xl"> </div>

			<ContentPreview className={'mx-auto z-50 max-h-96 rounded-lg'} fileData={fileData} url={fileContentUrl} />
			
			<div className="flex z-50 flex-col justify-center mx-auto space-y-3">
				<p className="text-center text-white">{fileData.user_file_name}</p>
				<div className="flex justify-center mx-auto space-x-6">
					<DownloadIcon className="fill-white w-8 h-8 cursor-pointer" onClick={ () => { downloadFromUrl(fileContentUrl, fileData.user_file_name) } } />
				</div>	
			</div>

		</div>
	)
}

export function FilePreview() {
	const params = useParams()
	const fileId = params['*']
	const [ fileData, setFileData ] = useState(null)
	const fileContentUrl = `${getApiBase()}/getFile/${fileId}/content`

	useEffect(() => {
		;(async () => {
	    let fileData = await getFileData(fileId)
	    setFileData(fileData)
		})()
	},[fileId])

	return <PageLayout fileData={fileData} fileContentUrl={fileContentUrl} />

}

export function SharedFilePreview() {
	const params = useParams()
	const slug = params['slug']
	const id = params['fileId']
	const [ fileData, setFileData ] = useState(null)
	const [ error, setError ] = useState(null)
	const fileContentUrl = `${getApiBase()}/getShare/${slug}/${id}/content`
	const getFile = async () => {
		let result = await getSharedFileData(slug, id)
		if(result.error)
			setError(result.error)

		setFileData(result.file)
	}

	useEffect(() => { getFile() } ,[slug])

	if(error)
		return (
			<Error error={error} />
		)

	return (
		<PageLayout fileData={fileData} fileContentUrl={fileContentUrl}  />
	)
}



