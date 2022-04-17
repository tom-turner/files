import { useState } from 'react'
import { Link } from "react-router-dom"
import FileUpload from "./FileUpload"
import { deleteFile, deleteDir, getFiles } from '../../lib/api'
import {ReactComponent as Delete}  from './assets/delete.svg';
import {ReactComponent as LinkIcon}  from './assets/link.svg';
import {ReactComponent as Grid}  from './assets/grid.svg';
import {ReactComponent as List}  from './assets/list.svg';

let ActionButtons = ({ fileName, fileId, to }) => {
	if(!fileId)
		return

	return (
		<div className="flex space-x-3">
				<p>{fileName}</p>
				<Link to={to} className="fill-gray-600 w-8 h-8" > 
					<LinkIcon />
				</Link>
				
				<button>
					<Delete onClick={ () => { deleteFile(fileId) }
					} className="fill-gray-600 w-8 h-8" />
				</button>
			</div>
	)
}

let ToggleViewMode = () => {
	let [icon, setIcon] = useState('')

	let grid = <Grid className="fill-gray-600 w-8 h-8" />
	let list = <List className="fill-gray-600 w-8 h-8" />

	return ( 
		<div className="flex space-x-3 px-1">
			<button>
				{list}
			</button>
		</div>
	)
}

let Actions = ({ fileName, fileId, to }) => {

	return (
		<div className="w-full flex justify-between py-3 space-x-6">
			<FileUpload />
			<div className="flex flex-grow justify-end space-x-6">
				<ActionButtons fileName={fileName} fileId={fileId} to={to} />
				<ToggleViewMode />
			</div>
		</div>
	)
} 

export default Actions;