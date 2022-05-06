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
import {ReactComponent as Menu}  from '../../assets/menu.svg';
import { Dropdown, DropdownItem, DropdownSplit } from '../Dropdown.js'

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
	let folderUpload = useRef()

	return (
		<div>
			<DropdownSplit onClick={() => { fileUpload.current.click() }} title='Upload Files' img={UploadIcon} >
					<DropdownItem title='Upload Files' onClick={() => { fileUpload.current.click() }} />
					<DropdownItem title='Upload Folder'onClick={() => { folderUpload.current.click() }} />
					<DropdownItem title='Create Tag' />
			</DropdownSplit>
			<input multiple type="file" ref={fileUpload} className={'hidden ' + props.className} onChange={props.onChange} />
			<input webkitdirectory="" mozdirectory="" type="file" ref={folderUpload} className={'hidden ' + props.className} onChange={props.onChange} />
		</div>
	)
}

let TagActions = ({selectedTag, refresh}) => {
	return (

		<Dropdown title="Actions" img={Menu}>
			<DropdownItem title='Share' onClick={ async () => handleTagShare( await createShare(selectedTag) ) } />
			<DropdownItem title='Rename' />
			<DropdownItem title='Delete' onClick={ async () => deleteTag(selectedTag, async result => refresh()) } />
		</ Dropdown>	
	)
}

let FileActions = ({selectedFiles, refresh}) => {
	return (
		<Dropdown title="Actions" img={Menu}>
			<DropdownItem title='Share' onClick={ async () => handleFileShare(selectedFiles, refresh) } />
			<DropdownItem title='Add Tag' onClick={  async () => createTag(selectedFiles, null, null, async result => refresh()) } />
			<DropdownItem title='Download' onClick={ async () => downloadAllFromUrl(selectedFiles) } />
			<DropdownItem title='Delete' onClick={ async () => deleteFiles(selectedFiles, async result => refresh()) } />
		</ Dropdown>			
	)
}

let ActionsMenu = ({ selectedFiles, selectedTag, refresh }) => {
	if(selectedFiles.length !== 0)
		return <FileActions selectedFiles={selectedFiles} refresh={refresh} />

	if(Object.keys(selectedTag).length !== 0)
		return <TagActions selectedTag={selectedTag} refresh={refresh} />

	return

}

let ToggleViewMode = ({setViewMode, viewMode}) => {
	let [toggle, setToggle]= useState(viewMode == 'list' ? true : false)

	return ( 
		<DropdownSplit onClick={() => { setToggle(!toggle); setViewMode(toggle ? 'grid' : 'list') }} title='' img={ viewMode === 'list' ? List : Grid} >
					<DropdownItem title='Grid' onClick={ () => { setViewMode('grid') }} />
					<DropdownItem title='List' onClick={ () => { setViewMode('list') }}/>
		</DropdownSplit>
	)
}

let Actions = ({className, selectedFiles, selectedTag, setViewMode, viewMode, handleFileUpload, refresh }) => {
	return (
		<div className={`max-w-screen flex w-full justify-between space-x-3 ` + className}>
			<FileUploadButton onChange={handleFileUpload} />

			<div className={'flex flex-grow justify-end space-x-3'}>
				<ActionsMenu selectedFiles={selectedFiles} selectedTag={selectedTag} refresh={refresh} />
				<ToggleViewMode setViewMode={setViewMode} viewMode={viewMode} />
			</div>
		</div>
	)
} 

export default Actions;