import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { handleUpload } from '../lib/upload'
import { uploadFiles, createSharedTag, createTag, createTagFileJoin, getFiles, createChildTag, updateTag } from '../lib/api'
import { FileSelector } from "../components/Files"
import { BlockPicker, TwitterPicker } from 'react-color';
import Search from "./Search"
import {ReactComponent as Exit}  from '../assets/exit.svg';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export function Modal({children, title, dismount}){
	return (
		<div  className="absolute flex items-center justify-center inset-0 z-50 px-3">
			<div onClick={ ()=> { dismount() }} className="absolute h-screen w-full bg-black opacity-50 z-40"> </div>
			<div className="flex flex-col bg-white z-50 text-black">
				<div className="flex justify-between w-screen max-w-md border bg-stone-100 py-3 px-6 space-x-6 ">
					<h2 className="text-2xl">{title}</h2>
					<Exit onClick={ () => dismount() } className="my-auto w-3 h-3 fill-stone-800 cursor-pointer" />
				</div>
				<div className="flex flex-col space-y-6 p-6 max-w-md text-base">
					{children}
				</div>
			</div>
		</div>
	)
}

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

export function ToggleSwitch({title, toggle, setToggle}){
	return (
		<div  className="flex justify-between w-full">
			<p>{title}</p>
			<div onClick={ () => { setToggle(!toggle) } } className={`w-12 h-6 shadow-lg rounded-full overflow-hidden ${ toggle ? 'bg-green-400' : 'bg-stone-400' }`}>
				<div className={`w-1/2 h-full bg-stone-700 rounded-full ${ toggle && 'translate-x-full' }`}>
				</div>
			</div>
		</div>
	)
}


export function NameColourPicker({setName, setColour, colour}){
	return (
		<div className="flex flex-col space-y-3">
			<input className="border-2 p-3 rounded-full" placeholder="Untitled" style={{borderColor:colour}} type="text" onChange={ (e) => { setName(e.target.value) } } />
			<div className="w-full flex justify-center">
				<TwitterPicker  triangle="hide" width="100%" color={colour} type="color" onChange={ (e) => { setColour(e.hex) } } />
			</div>
		</div>
	)	
}

export function ManageAccess({ sharedWith, setSharedWith, isPublic, setIsPublic }){
	let textInput = useRef()

	let handleKeyDown = (e) => {
		if (e.key === 'Enter') {
      setSharedWith([ ...sharedWith, textInput.current.value ])
      textInput.current.value = ''
    }
	}

	let sharedWithList = sharedWith.map( ( user,i ) => {
		return ( <div key={i} className="flex justify-between">
				<p>{user}</p>
				{ user !== 'You' && <Exit className="w-3 h-3 fill-stone-600 cursor-pointer my-auto" onClick={ () => setSharedWith( sharedWith.filter( e => e !== user ) )} /> }
			</div>
		)
	})

	return (
		<div className="flex flex-col space-y-6">
			<p className="font-bold">People with access</p>
			{ sharedWithList }
			<div className="flex flex-col">
				<ToggleSwitch title={'Public'} toggle={isPublic} setToggle={setIsPublic} />
				<p className="text-sm">Anyone with a link can view</p>
			</div>
			<input ref={textInput} onKeyDown={handleKeyDown} type="text" className="border p-3 rounded-full" placeholder="Add people by email or username" />
		</div>
	)
}

export function NewSharedUpload({dismount}){
	let [ fileUploadModal, setFileUploadModal ] = useState(false)
	let [ tagName, setTagName ] = useState('Untitled')
	let [ tagColour, setTagColour ] = useState('#6365f1')
	let [ fileData, setFileData ] = useState(null)
	let [ isPublic, setIsPublic ] = useState( false )
	let [ sharedWith, setSharedWith ] = useState(['You'])

	let onUpload = async () => {
		let tag = await createTag({
			name: tagName,
			colour: tagColour,
			sharing: {
				public: isPublic,
				sharedWith: sharedWith
			}
		})
		createTagFileJoin( fileData, tag, async (res) => {
			dismount()
		})
	}

	return(
		<Modal title="Create New Share" dismount={dismount}>
					<NameColourPicker setColour={setTagColour} colour={tagColour} setName={setTagName} />
					<ManageAccess sharedWith={sharedWith} setSharedWith={setSharedWith} isPublic={isPublic} setIsPublic={setIsPublic} />
					<button className={"bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2"} onClick={ async () => setFileUploadModal(true) } >Create</button>
					{ fileUploadModal && <FileUpload  dismount={ () => { onUpload() } } setFileData={ (data) => { setFileData(data) } } /> }
		</Modal>
	)
}

export function CreateSharedTag({dismount}){
	let [tagName, setTagName ] = useState('Untitled')
	let [tagColour, setTagColour ] = useState('#6365f1')
	let [ isPublic, setIsPublic ] = useState( false )
	let [ sharedWith, setSharedWith ] = useState(['You'])

	let handleSubmit = async () => {
		let tag = await createTag({
			name: tagName,
			colour: tagColour,
			sharing: {
				public: isPublic,
				sharedWith: sharedWith
			}
		});
		dismount(tag)
	}

	console.log(isPublic)

	return(
		<Modal title="Create New Share" dismount={dismount}>
					<NameColourPicker setColour={ (e) => setTagColour(e) } colour={tagColour} setName={ (e) => setTagName(e) } />
					<ManageAccess sharedWith={sharedWith} setSharedWith={setSharedWith} isPublic={isPublic} setIsPublic={setIsPublic} />
					<button className={"bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2"} onClick={handleSubmit} >Create</button>
		</Modal>
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
		<Modal title="Create Folder" dismount={dismount}>
					<NameColourPicker setColour={ (e) => setTagColour(e) } colour={tagColour} setName={ (e) => setTagName(e) } />
					<button className={"bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2"} onClick={  () => { handleSubmit() } } >Create</button>
		</Modal>
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
		<Modal title="Add Files" dismount={dismount}>
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
		</Modal>
	)
}


export function EditSharing({tag, dismount}){
	let sharing = {
		shared: !!tag.sharing,
		...tag.sharing
	}
	
	let [ isShared , setIsShared ] = useState( sharing.shared )
	let [ isPublic, setIsPublic ] = useState( sharing.public )
	let [ sharedWith, setSharedWith ] = useState(['You'])

	let handleSubmit = () => {
		updateTag(tag.id, {
			public: isPublic,
			sharedWith: sharedWith.filter( e => e !== 'You')
		})
		dismount()
	}

	console.log(tag)

	return(
		<Modal title={`Share '${tag.tag_name}'`} dismount={dismount} >
				<ManageAccess sharedWith={sharedWith} setSharedWith={setSharedWith} isPublic={isPublic} setIsPublic={setIsPublic} />
				<div className="flex justify-between">
					<CopyToClipboard text={`${window.location.protocol}//${window.location.host}/public/share-${tag.id}`}
						onCopy={() => alert('link copied') }>
						<button className="border rounded-lg py-3 px-6 border text-indigo-500">Copy Link</button>
					</CopyToClipboard>
					<button onClick={ () => handleSubmit() } className="border rounded-lg py-3 px-6 bg-indigo-500 hover:bg-indigo-600 text-white">Update</button>
				</div>
		</Modal>
	)

}
