import { useState, useRef } from 'react'
import { deleteFiles, createTag, deleteTag, createShare, getSharedFiles } from '../../lib/api'
import { downloadAllFromUrl } from '../../lib/download'
import {ReactComponent as Exit}  from '../../assets/exit.svg';
import {ReactComponent as Grid}  from '../../assets/grid.svg';
import {ReactComponent as List}  from '../../assets/list.svg';
import {ReactComponent as UploadIcon}  from '../../assets/upload.svg';
import {ReactComponent as Menu}  from '../../assets/menu.svg';
import { Dropdown, DropdownItem, DropdownSplit } from '../Dropdown.js'
import { BlockPicker } from 'react-color';
import { CopyToClipboard } from 'react-copy-to-clipboard';

let CopyLink = ({ url, setPopupContent }) => {
	return(
		<div className="flex flex-col">
			<div className="flex justify-between w-full border bg-zinc-50 py-3 px-6">
				<h2 className="text-2xl">Your Link</h2>
				<Exit onClick={ () => setPopupContent(null) } className="my-auto w-3 h-3 fill-gray-800 cursor-pointer" />
			</div>

			<div className="flex flex-col space-y-6 p-6 max-w-md">
				<p> {url} </p>
				<CopyToClipboard text={url}
				onCopy={() => setPopupContent(null) }>
				<button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2">Copy To Clipboard</button>
				</CopyToClipboard>
			</div>
			
		</div>

	)
}

let handleTagShare = ({ slug }) => {
	return `${window.location.protocol}//${window.location.host}/share/${slug}`
}

let handleFileShare = async ( selectedFiles, tagName, tagColour, refresh, setPopupContent, shareing ) => {
	createTag(selectedFiles, tagName, tagColour, async result => {
		let body = await result
		
		if(!body.tag.tagId)
			return

		if(shareing){
			let share = await createShare({ id: body.tag.tagId })	
			setPopupContent( <CopyLink url={`${window.location.protocol}//${window.location.host}/share/${share.slug}/${body.fileId}`} setPopupContent={setPopupContent}/> )
		} else {
			setPopupContent(null)
		}
		
		refresh()
	})
}

let FileShareForm = ({selectedFiles, refresh, setPopupContent}) =>{
	let [tagName, setTagName ] = useState('')
	let [tagColour, setTagColour ] = useState('#6365f1')
	let title = selectedFiles.length > 1 ? 'Share these files' : 'Share this file'

	return(
		<div className="flex flex-col">
			<div className="flex justify-between w-full border bg-zinc-50 py-3 px-6">
				<h2 className="text-2xl">{title}</h2>
				<Exit onClick={ () => setPopupContent(null) } className="my-auto w-3 h-3 fill-gray-800 cursor-pointer" />
			</div>

			<div className="flex flex-col space-y-6 p-6 max-w-md">
				<p>{` ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected - Share your files using Tags. Sharing files will create a shared Tag for you. Anyone with a link can view this file. `}</p>
				<input className="border border-2 rounded-r-full rounded-b-full px-3 py-1" style={{borderColor: tagColour}} placeholder="Name your Tag" type="text" onChange={ (e) => { setTagName(e.target.value) } } />
				<div className="w-full flex justify-center">
					<BlockPicker width="75%" type="color" color={tagColour} onChange={ (e) => { setTagColour(e.hex) } } />
				</div>
				<button className={"bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2"} onClick={ () => handleFileShare(selectedFiles, tagName, tagColour , refresh, setPopupContent, true) } >Create</button>
			</div>
			
		</div>

	)
}

export function NewTagForm({ selectedFiles, refresh, setPopupContent }){
	let [tagName, setTagName ] = useState('')
	let [tagColour, setTagColour ] = useState('#6365f1')

	let title = selectedFiles.length > 1 ? 'Tag these files' : 'Tag this file'

	return(
		<div className="flex flex-col">
			<div className="flex justify-between w-full border bg-zinc-50 py-3 px-6">
				<h2 className="text-2xl">{title}</h2>
				<Exit onClick={ () => setPopupContent(null) } className="my-auto w-3 h-3 fill-gray-800 cursor-pointer" />
			</div>

			<div className="flex flex-col space-y-6 p-6 max-w-md">
				<p>{` ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected - Tag files so you can organize them. The file will not be shared until you share the Tag.`}</p>
				<input className="border border-2 rounded-r-full rounded-b-full px-3 py-1" style={{borderColor: tagColour}} placeholder="Name your Tag." type="text" onChange={ (e) => { setTagName(e.target.value) } } />
				<div className="w-full flex justify-center">
					<BlockPicker width="75%" type="color" color={tagColour} onChange={ (e) => { setTagColour(e.hex) } } />
				</div>
				<button className={"bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2"} onClick={ () => handleFileShare(selectedFiles, tagName, tagColour , refresh, setPopupContent, false) } >Create</button>
			</div>
		</div>
	)
}


let FileUploadButton = (props) => {
	let fileUpload = useRef()
	let folderUpload = useRef()

	return (
		<div>
			<DropdownSplit onClick={() => { fileUpload.current.click() }} title='Upload Files' img={UploadIcon} >
					<DropdownItem title='Upload Files' onClick={() => { fileUpload.current.click() }} />
					<DropdownItem title='Upload Folder'onClick={() => { folderUpload.current.click() }} />
			</DropdownSplit>
			<input multiple type="file" ref={fileUpload} className={'hidden ' + props.className} onChange={props.onChange} />
			<input webkitdirectory="" mozdirectory="" type="file" ref={folderUpload} className={'hidden ' + props.className} onChange={props.onChange} />
		</div>
	)
}

let TagActions = ({selectedTag, refresh, setPopupContent}) => {
	return (

		<Dropdown title="Actions" img={Menu}>
			<DropdownItem title='Share' onClick={ async () => setPopupContent( <CopyLink url={handleTagShare(await createShare(selectedTag))} setPopupContent={setPopupContent} /> ) } />
			<DropdownItem title='Rename' />
			<DropdownItem title='Delete' onClick={ async () => deleteTag(selectedTag, async result => refresh()) } />
		</ Dropdown>	
	)
}

let FileActions = ({selectedFiles, refresh, setPopupContent}) => {
	return (
		<Dropdown title="Actions" img={Menu}>
			<DropdownItem title='Share' onClick={ async () => setPopupContent( < FileShareForm selectedFiles={selectedFiles} refresh={refresh} setPopupContent={setPopupContent} /> )  } />
			<DropdownItem title='Add Tag' onClick={  async () => setPopupContent( < NewTagForm selectedFiles={selectedFiles} refresh={refresh} setPopupContent={setPopupContent} /> ) } />
			<DropdownItem title='Download' onClick={ async () => downloadAllFromUrl(selectedFiles) } />
			<DropdownItem title='Delete' onClick={ async () => deleteFiles(selectedFiles, async result => refresh()) } />
		</ Dropdown>			
	)
}

let ActionsMenu = ({ selectedFiles, selectedTag, refresh, setPopupContent }) => {
	if(selectedFiles && selectedFiles.length !== 0)
		return <FileActions selectedFiles={selectedFiles} refresh={refresh} setPopupContent={setPopupContent} />

	if(selectedTag && Object.entries(selectedTag).length !== 0)
		return <TagActions selectedTag={selectedTag} refresh={refresh} setPopupContent={setPopupContent} />

	return

}

let ToggleViewMode = ({setViewMode, viewMode}) => {
	let [toggle, setToggle]= useState(viewMode === 'list' ? true : false)

	return ( 
		<DropdownSplit onClick={() => { setToggle(!toggle); setViewMode(toggle ? 'grid' : 'list') }} title='' img={ viewMode === 'list' ? List : Grid} >
			<DropdownItem title='Grid' onClick={ () => { setViewMode('grid') }} />
			<DropdownItem title='List' onClick={ () => { setViewMode('list') }}/>
		</DropdownSplit>
	)
}

let Actions = ({ state, setState, handleFileUpload }) => {
	return (
		<div className={`max-w-screen border-b flex w-full justify-between space-x-3 p-3 sm:px-6 bg-zinc-50 `}>
			<FileUploadButton onChange={handleFileUpload} />

			<div className={'flex flex-grow justify-end space-x-3'}>
				<ActionsMenu selectedFiles={state.selectedFiles} selectedTag={state.selectedTag} refresh={ (e) => { state.setData(e) }} setPopupContent={ (e) => setState({ popupContent: e }) } />
				<ToggleViewMode setViewMode={ (e) =>  state.setViewMode(e) } viewMode={state.viewMode} />
			</div>
		</div>
	)
} 

export default Actions;