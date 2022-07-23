import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { handleUpload } from '../lib/upload'
import { uploadFiles, createSharedTag, createTag, createTagFileJoin, getFiles, createChildTag } from '../lib/api'
import { FileSelector } from "../components/Files"
import { BlockPicker } from 'react-color';
import Search from "./Search"
import {ReactComponent as Exit}  from '../assets/exit.svg';

export function UploadProgress({ progress, message }){
  return (
      <div className="absolute z-50 uleft-0 bottom-0 m-6 p-3 w-64 bg-stone-900 border border-stone-600 rounded-xl">
        <p className="text-sm font-bold text-white"> {message} </p>
        <div className={"w-full bg-white m-2 mx-auto rounded-full overflow-hidden "}> 
          <div className="w-0 h-2 bg-green-600" style={{width: progress+"%"}}>  </div>
        </div>
      </div>
  )
}

export function FileUpload({dismount, setFileData}){
  let fileUpload = useRef()
  let [ uploadProgress, setUploadProgress ] = useState(false)
  useEffect( () => {
    fileUpload.current.click()
  }, [fileUpload])

  if(uploadProgress.success)
  	return dismount()

  if(uploadProgress.data && setFileData){
  	setFileData( [ uploadProgress.data ]) // return funcion takes an array so that it can handle multiple files, but uploadProgress currently only returns one item.
  }

  return (
    <div>
      <input multiple type="file" ref={fileUpload} className={'hidden'} onChange={ (e) => { handleUpload(e, (progress) => { setUploadProgress(progress) }) } } />
      { uploadProgress && <UploadProgress progress={uploadProgress.percent} message={uploadProgress.message} />}
    </div>
  )
}

export function FolderUpload({dismount}){
  let folderUpload = useRef()
  let [ uploadProgress, setUploadProgress ] = useState(false)

  useEffect( () => {
    folderUpload.current.click()
  }, [folderUpload])

  if(uploadProgress.percent === 100)
  	return dismount()

  return (
    <div>
      <input webkitdirectory="" mozdirectory="" type="file" ref={folderUpload} className={'hidden'} onChange={ (e) => { handleUpload(e, (progress) => { setUploadProgress(progress) }) } } />
      { uploadProgress && <UploadProgress progress={uploadProgress.percent} message={uploadProgress.message} />}
    </div>
  )
}

export function NewSharedUpload({dismount}){
	let [tagName, setTagName ] = useState('')
	let [fileUploadModal, setFileUploadModal ] = useState(false)
	let [tagColour, setTagColour ] = useState('#6365f1')
	let [ fileData, setFileData ] = useState(null)

	let onUpload = async () => {
		createTagFileJoin( fileData, tagName, tagColour, async (res) => {
			let sharedTag = await createSharedTag(tagName, tagColour)

			if(sharedTag)
				dismount()
		})
	}

	if(fileUploadModal)
		return <FileUpload  dismount={ () => { onUpload() } } setFileData={ (data) => { console.log(data); setFileData(data) } } />

	return(
		<div  className="absolute flex items-center justify-center inset-0 z-50 px-3">
			<div onClick={ ()=> { dismount() }} className="absolute h-screen w-full bg-black opacity-50 z-40"> </div>
			<div className="flex flex-col bg-white z-50">
				<div className="flex justify-between w-full border bg-stone-100 py-3 px-6">
					<h2 className="text-2xl">{'New Share'}</h2>
					<Exit onClick={ () => dismount() } className="my-auto w-3 h-3 fill-stone-800 cursor-pointer" />
				</div>

				<div className="flex flex-col space-y-6 p-6 max-w-md">
					<input className="border border-2 rounded-r-full rounded-b-full px-3 py-1" style={{borderColor: tagColour}} placeholder="Name your Tag" type="text" onChange={ (e) => { setTagName(e.target.value) } } />
					<div className="w-full flex justify-center">
						<BlockPicker width="75%" type="color" color={tagColour} onChange={ (e) => { setTagColour(e.hex) } } />
					</div>
					<button className={"bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2"} onClick={ async () => setFileUploadModal(true) } >Create</button>
				</div>
				
			</div>
		</div>
	)
}


export function CreateSharedTag({dismount}){
	let [tagName, setTagName ] = useState('')
	let [tagColour, setTagColour ] = useState('#6365f1')

	return(
		<div  className="absolute flex items-center justify-center inset-0 z-50 px-3">
			<div onClick={ ()=> { dismount() }} className="absolute h-screen w-full bg-black opacity-50 z-40"> </div>
			<div className="flex flex-col bg-white z-50">
				<div className="flex justify-between w-full border bg-stone-100 py-3 px-6">
					<h2 className="text-2xl">Create Shared Folder</h2>
					<Exit onClick={ () => dismount() } className="my-auto w-3 h-3 fill-stone-800 cursor-pointer" />
				</div>

				<div className="flex flex-col space-y-6 p-6 max-w-md">
					<input className="border border-2 rounded-r-full rounded-b-full px-3 py-1" style={{borderColor: tagColour}} placeholder="Name your Tag" type="text" onChange={ (e) => { setTagName(e.target.value) } } />
					<div className="w-full flex justify-center">
						<BlockPicker width="75%" type="color" color={tagColour} onChange={ (e) => { setTagColour(e.hex) } } />
					</div>
					<button className={"bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2"} onClick={ async () => { await createSharedTag(tagName, tagColour); dismount() } } >Create</button>
				</div>
				
			</div>
		</div>
	)
}

export function CreateTag({dismount, setFileData}){
	let tagId = useParams()['tagId']
	let [tagName, setTagName ] = useState('')
	let [tagColour, setTagColour ] = useState('#6365f1')

	let handleSubmit = async () => {
		let response = await createTag(tagName, tagColour);

		if(!tagId) 
			return dismount()

		let childTag = createChildTag(response.tagId, tagId)

		if(response.success)
			return dismount()
	}

	return(
		<div  className="absolute flex items-center justify-center inset-0 z-50 px-3">
			<div onClick={ ()=> { dismount() }} className="absolute h-screen w-full bg-black opacity-50 z-40"> </div>
			<div className="flex flex-col bg-white z-50">
				<div className="flex justify-between w-full border bg-stone-100 py-3 px-6">
					<h2 className="text-2xl">Create Folder</h2>
					<Exit onClick={ () => dismount() } className="my-auto w-3 h-3 fill-stone-800 cursor-pointer" />
				</div>

				<div className="flex flex-col space-y-6 p-6 max-w-md">
					<input className="border border-2 rounded-r-full rounded-b-full px-3 py-1" style={{borderColor: tagColour}} placeholder="Name your Tag" type="text" onChange={ (e) => { setTagName(e.target.value) } } />
					<div className="w-full flex justify-center">
						<BlockPicker width="75%" type="color" color={tagColour} onChange={ (e) => { setTagColour(e.hex) } } />
					</div>
					<button className={"bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2"} onClick={  () => { handleSubmit() } } >Create</button>
				</div>
				
			</div>
		</div>
	)
}


export function AddFilesToTag({dismount, setFileData}){
	let [ files, setFiles ] = useState([])
	let [searchQuery, setSearchQuery] = useState(null)
	let [selectedFiles, setSelectedFiles] = useState([])

	useEffect( () => {
    ( async () => {
      let response = await getFiles(searchQuery || '')
      setFiles( response.files )
    } )()
  },[searchQuery])

  let handleSelectedFiles = (file) =>{
    if(selectedFiles.includes(file))
      return setSelectedFiles( selectedFiles.filter( e => { return e !== file } ) )
    else
      return setSelectedFiles([...selectedFiles, file])
  }

	return(
		<div  className="absolute flex items-center justify-center inset-0 z-50 px-3">
			<div onClick={ ()=> { dismount() }} className="absolute h-screen w-full bg-black opacity-50 z-40"> </div>
			<div className="flex flex-col bg-white z-50">
				<div className="flex justify-between w-full bg-stone-100 py-3 px-6">
					<h2 className="text-2xl">Add Files</h2>
					<Exit onClick={ () => dismount() } className="my-auto w-3 h-3 fill-stone-800 cursor-pointer" />
				</div>
				<div className="flex flex-col space-y-6 p-6 ">
					<Search fn={(e) => setSearchQuery(e)} className={'w-full border border-stone-300 rounded-full'} />
					<div className="max-h-96 overflow-scroll h-screen max-w-2xl w-screen">
						<FileSelector 
	            files={files} 
	            selectedFiles={selectedFiles} 
	            setSelectedFiles={handleSelectedFiles} 
	            className={'text-black '}
          	/> 
          </div>
					<button className={"bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2"} onClick={ async () => { setFileData(selectedFiles); dismount() } } >Add</button>
				</div>
				
			</div>
		</div>
	)
}
