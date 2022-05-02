import { useState, useRef } from 'react'
import { Link } from "react-router-dom"
import { deleteFiles, deleteDir, getFiles, getFileContent, createTag, deleteTag, createShare } from '../../lib/api'
import { getApiBase } from '../../lib/apiBase'
import { downloadAllFromUrl } from '../../lib/download'
import {ReactComponent as Delete}  from '../../assets/delete.svg';
import {ReactComponent as Share}  from '../../assets/share.svg';
import {ReactComponent as DownloadIcon}  from '../../assets/download.svg';
import {ReactComponent as Grid}  from '../../assets/grid.svg';
import {ReactComponent as List}  from '../../assets/list.svg';
import {ReactComponent as UploadIcon}  from '../../assets/upload.svg';
import {ReactComponent as AddTag}  from '../../assets/add-tag.svg';

let handleTagShare = ({ slug }) => {
	alert(`share url: ${window.location.protocol}//${window.location.host}/share/${slug}`)

}

let handleFileShare = async ( selectedFiles, refresh ) => {
	createTag(selectedFiles, null, null, async result => {
		let body = await result
		
		if(!body.tag.tagId)
			return

		let share = await createShare({ id: body.tag.tagId })

		alert(`share url: ${window.location.protocol}//${window.location.host}/share/${share.slug}/${body.fileId}`)

		refresh()
	})

}

let FileUploadButton = (props) => {
	let fileUpload = useRef()
	return (
		<div onClick={() => { fileUpload.current.click() }} className="flex space-x-3 bg-green-500 hover:bg-indigo-500 px-4 py-2 rounded-lg cursor-pointer">
			<UploadIcon className={'w-6 h-6 my-auto fill-white'} />
			<p className="my-auto text-white"> Upload Files </p>
			<input type="file" ref={fileUpload} className={'hidden ' + props.className} onChange={props.onChange} />
		</div>
	)
}

let TagActions = ({selectedTag, refresh}) => {
	return (
		<div className="flex space-x-3">

			<button>
				<Share onClick={ async () => handleTagShare( await createShare(selectedTag) ) } className="fill-gray-600 w-8 h-8  my-auto" />
			</button>
			
			<button>
				<Delete onClick={ () => deleteTag(selectedTag, async result => refresh())} className="fill-gray-600 w-8 h-8  my-auto" />
			</button>

		</div>
	)
}

let FileActions = ({selectedFiles, refresh}) => {
	return (
		<div className="flex space-x-3">

			<button>
				<Share onClick={ async () => handleFileShare(selectedFiles, refresh) } className="fill-gray-600 w-8 h-8  my-auto" />
			</button>

			<button onClick={ () => createTag(selectedFiles, null, null, async result => refresh()) }> 
				<AddTag className="fill-gray-600 w-8 h-8  my-auto" refresh={refresh} />
			</button>

			<button onClick={ () => { downloadAllFromUrl(selectedFiles) } } > 
				<DownloadIcon className="fill-gray-600 w-8 h-8  my-auto" />
			</button>
			
			<button>
				<Delete onClick={ () => deleteFiles(selectedFiles, async result => refresh())} className="fill-gray-600 w-8 h-8  my-auto" />
			</button>

		</div>
	)
}

let ActionButtons = ({ selectedFiles, selectedTag, refresh }) => {
	if(selectedFiles.length !== 0)
		return <FileActions selectedFiles={selectedFiles} refresh={refresh} />

	if(Object.keys(selectedTag).length !== 0)
		return <TagActions selectedTag={selectedTag} refresh={refresh} />

	return

}

let ToggleViewMode = ({setViewMode, viewMode}) => {
	let [toggle, setToggle]= useState(viewMode == 'list' ? true : false)

	let grid = <Grid className="fill-gray-600 w-8 h-8" />
	let list = <List className="fill-gray-600 w-8 h-8" />

	return ( 
			<button onClick={() => { setToggle(!toggle); setViewMode(toggle ? 'grid' : 'list') }}>
				{ viewMode === 'list' ? list : grid} 
			</button>
	)
}

let Actions = ({ selectedFiles, selectedTag, setViewMode, viewMode, handleFileUpload, refresh }) => {
	return (
		<div className="max-w-screen flex w-full justify-between space-x-3">
			<FileUploadButton onChange={handleFileUpload} />
			<div className={'flex flex-grow justify-end space-x-3'}>
				<ActionButtons selectedFiles={selectedFiles} selectedTag={selectedTag} refresh={refresh} />
				<ToggleViewMode setViewMode={setViewMode} viewMode={viewMode} />
			</div>
		</div>
	)
} 

export default Actions;