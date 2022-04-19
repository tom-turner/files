import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFileData, getFileContent } from '../lib/api'
import ServerCheck from "../components/ServerCheck"
import IconByType from './IconByType'
import {ReactComponent as LinkIcon}  from '../assets/link.svg';

let Audio = ({fileData, fileContent, className}) => {
	return (
		<audio controls  src={fileContent.url} className={className}/>
	)	
}

let Video = ({fileData, fileContent, className}) => {
	return (
		<video controls src={fileContent.url} className={className}/>
	)
}

let Image = ({fileData, fileContent, className}) => {
	return (
		<img src={fileContent.url} className={className}/>
	)
}

let Default = ({fileData, fileContent, className}) => {
	return ( <IconByType fileType={fileData.file_type || '' } className={className} />
	)
}

let ContentPreview = ({fileData, fileContent, className}) => {
	let fileType = fileData.file_type ? fileData.file_type.split('/')[0] : {}

	switch(fileType){
		case 'audio':
			return <Audio fileData={fileData} fileContent={fileContent} className={className} />
			break;
		case 'video':
			return <Video fileData={fileData} fileContent={fileContent} className={className} />
			break;
		case 'image':
			return <Image fileData={fileData} fileContent={fileContent} className={className}/>
			break;
		default:
			return <Default fileData={fileData} fileContent={fileContent} className={className}/>
	}

}

function download(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

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
		})()
	},[fileId])

	return (
		<div className="bg-black bg-opacity-80 relative w-full relative min-h-screen overflow-scroll mx-auto flex flex-col justify-center space-y-3">
			
			<p onClick={ ()=>{ window.location.href = fileData.user_file_path } } className="absolute w-full h-screen cursor-pointer inset-0 text-right text-white px-6 py-2 font-bold text-2xl">x</p>
			
			<div className="absolute top-0 left-1/3 z-0 h-screen rounded-full animate-[spin_8s_linear_infinite] w-96 bg-green-400 blur-3xl"> </div>
      <div className="absolute top-0 right-1/3 z-0 h-screen rounded-full animate-[spin_20s_linear_infinite] w-96 bg-indigo-400 blur-3xl"> </div>


			<ContentPreview className={'mx-auto z-50 max-h-96 rounded-lg'} fileData={fileData} fileContent={fileContent} />
			
			<div className="flex z-50 flex-col justify-center mx-auto space-y-3">
				<p className="text-center text-white">{fileData.user_file_name}</p>
				<div className="flex justify-center mx-auto space-x-6">
					<LinkIcon className="fill-white w-8 h-8 cursor-pointer" onClick={ () => { fileContent.blob().then(blob => download(blob, fileData.user_file_name)) } } />
				</div>	
			</div>

		</div>
	)
}

export default FilePreview