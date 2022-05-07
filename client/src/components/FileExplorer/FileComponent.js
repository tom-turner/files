import { useState, useEffect } from "react";
import IconByType from '../IconByType'
import {ReactComponent as Delete}  from '../../assets/delete-cross.svg';
import { removeTag } from '../../lib/api'

let Tag = ({tag, active, file}) => {
	if(!tag)
		return

	return (
		<div className={"truncate px-4 cursor-auto group text-white rounded-full rounded-tl-md py-1 whitespace-nowrap flex justify-center border-4 " +( active ? 'border-green-200 shadow-lg ' : 'border-gray-100 ' ) } style={{backgroundColor: tag.tag_colour}} >
			<p>{tag.tag_name}</p>
			<Delete className="w-3 h-3 my-auto mx-auto group-hover:inline hidden ml-3 fill-white cursor-pointer" onClick={ () => { removeTag(file.id, tag.id) } } />
		</div>
	)
}

let FileComponent = ({file, selectedFiles, setSelectedFiles, className, viewMode, setSelectedTag}) => {
	let [ active, setActive ] = useState(false)
	let [ clicked, setClicked ] = useState(false)
	let filetype = file.file_type

	useEffect(()=>{
		selectedFiles.find( obj => obj.id === file.id ) === undefined ? setActive(false) : setActive(true)
	},[selectedFiles])

	let clickFunc = () => {
	  if(clicked){
        return window.location.href = '/file:/'+file.id
      }
      setSelectedTag({})
      setClicked(true)
      setTimeout(() => {
        setClicked(false)
      },350)

      if(active){
      	setSelectedFiles(selectedFiles.filter((obj)=>{
      		return obj.id !== file.id
      	}))
      } else{
      	setSelectedFiles([ ...selectedFiles ,file])
      }
	}

	const tags = file.fileTags.map((tag) =>{
		return (
			<Tag key={tag.id} tag={tag} active={active} file={file} />
		)
	})

	let dragFunc = (e) => {
		setActive(true)
      	setSelectedFiles([ ...selectedFiles, file])
	}
	
	return (
		<div draggable="true" onDragStart={dragFunc} className={"relative flex overflow-hidden break-words cursor-pointer " + ( active ? ' bg-green-500 rounded-lg ' : '' )+(viewMode == 'grid' ? 'flex-col' : 'flex-row' ) } onClick={clickFunc}>
			<IconByType filetype={file.file_type} className={"z-50 p-2 mx-auto w-12 md:w-24 rounded-lg " + ( active ? 'bg-green-200 shadow-lg ' : 'bg-gray-100 ' ) + (viewMode == 'grid' ? 'w-16 md:w-24 m-2' : 'w-20 md:w-36' )} />
			
			<p className={"my-auto z-50 w-full underline px-4 "+ ( active ? ' text-white ' : ' text-gray-800  ' ) + (viewMode == 'grid' ? 'text-center' : 'text-left' )}>{file.user_file_name }</p>
			
			<div className="flex my-auto justify-center items-center text-xs mb-4 space-x-3 flex-nowrap px-3">
				{ tags }
			</div>

			<p className={"text-right my-auto mx-auto z-50 w-full p-4 hidden md:block" + (viewMode == 'grid' ? 'hidden' : '' ) + ( active ? ' text-white ' : ' text-gray-800 ' ) }>{'Last Modified: ' +  new Date(file.last_modified).toLocaleDateString() }</p>
		</div>
	)
}

export default FileComponent