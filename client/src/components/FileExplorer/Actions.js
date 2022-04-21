import { useState, useRef } from 'react'
import { Link } from "react-router-dom"
import { deleteFiles, deleteDir, getFiles, getFileContent } from '../../lib/api'
import { downloadFiles } from '../../lib/download'
import {ReactComponent as Delete}  from '../../assets/delete.svg';
import {ReactComponent as LinkIcon}  from '../../assets/link.svg';
import {ReactComponent as Grid}  from '../../assets/grid.svg';
import {ReactComponent as List}  from '../../assets/list.svg';
import {ReactComponent as UploadIcon}  from '../../assets/upload.svg';


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

let ActionButtons = ({ selectedFiles }) => {
	if(selectedFiles.length === 0)
		return

	return (
		<div className="flex space-x-3">
			
			<button onClick={ () => { downloadFiles(selectedFiles) } } > 
				<LinkIcon className="fill-gray-600 w-8 h-8  my-auto" />
			</button>
			
			<button>
				<Delete onClick={ () => { deleteFiles(selectedFiles) }} className="fill-gray-600 w-8 h-8  my-auto" />
			</button>

		</div>
	)
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

let Actions = ({ selectedFiles, setViewMode, viewMode, handleFileUpload }) => {
	return (
		<div className="max-w-screen flex w-full justify-between space-x-3">
			<FileUploadButton onChange={handleFileUpload} />
			<div className={'flex flex-grow justify-end space-x-3'}>
				<ActionButtons selectedFiles={selectedFiles}/>
				<ToggleViewMode setViewMode={setViewMode} viewMode={viewMode} />
			</div>
		</div>
	)
} 

export default Actions;