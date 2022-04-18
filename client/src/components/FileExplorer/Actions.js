import { useState } from 'react'
import { Link } from "react-router-dom"
import FileUpload from "./FileUpload"
import { deleteFile, deleteDir, getFiles } from '../../lib/api'
import {ReactComponent as Delete}  from './assets/delete.svg';
import {ReactComponent as LinkIcon}  from './assets/link.svg';
import {ReactComponent as Grid}  from './assets/grid.svg';
import {ReactComponent as List}  from './assets/list.svg';

let ActionButtons = ({ selectedFiles }) => {
	if(!selectedFiles)
		return

	console.log(selectedFiles)

	return (
		<div className="flex space-x-3">
				<p>{selectedFiles.user_file_name}</p>
				<Link to={'/file:/'+selectedFiles.id} className="fill-gray-600 w-8 h-8" > 
					<LinkIcon />
				</Link>
				
				<button>
					<Delete onClick={ () => { deleteFile(selectedFiles.id) }
					} className="fill-gray-600 w-8 h-8" />
				</button>
			</div>
	)
}

let ToggleViewMode = ({setViewMode}) => {
	let [toggle, setToggle] = useState(false)

	let grid = <Grid className="fill-gray-600 w-8 h-8" />
	let list = <List className="fill-gray-600 w-8 h-8" />

	return ( 
		<div className="flex space-x-3 px-1">
			<button onClick={() => { setToggle(!toggle); setViewMode(toggle ? 'grid' : 'list') }}>
				{toggle ? list : grid}
			</button>
		</div>
	)
}

let Actions = ({ selectedFiles, setViewMode }) => {

	return (
		<div className="w-full flex justify-between py-3 space-x-6">
			<FileUpload />
			<div className="flex justify-end space-x-3">
				<ActionButtons selectedFiles={selectedFiles}/>
				<ToggleViewMode setViewMode={setViewMode} />
			</div>
		</div>
	)
} 

export default Actions;