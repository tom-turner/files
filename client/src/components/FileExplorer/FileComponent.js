import { useState, useEffect } from "react";
import IconByType from '../IconByType'

let Tag = ({tag}) => {
	return (
		<div className="px-4 text-white rounded-full rounded-tl-md py-1 whitespace-nowrap flex justify-center" style={{backgroundColor: tag.tag_colour}} >
			<p>{tag.tag_name}</p>
		</div>
	)
}

let FileComponent = ({file, selectedFiles, setSelectedFiles, className, viewMode}) => {
	let [ active, setActive ] = useState(false)
	let [ clicked, setClicked ] = useState(false)
	let fileType = file.file_type

	let clickFunc = () => {
	  if(clicked){
        return window.location.href = '/file:/'+file.id
      }
      setClicked(true)
      setTimeout(() => {
        setClicked(false)
      },350)

      if(active){
      	setActive(false)
      	setSelectedFiles(selectedFiles.filter((obj)=>{
      		return obj.id !== file.id
      	}))
      } else{
      	setActive(true)
      	setSelectedFiles([ ...selectedFiles ,file])
      }
	}

	const tags = file.fileTags.map((tag) =>{
		return (
			<Tag tag={tag} />
		)
	})

	let dragFunc = (e) => {
		setActive(true)
      	setSelectedFiles([ ...selectedFiles, file])
	}
	
	return (
		<div draggable="true" onDragStart={dragFunc} className={"relative flex overflow-hidden break-words cursor-pointer " + ( active ? ' bg-green-500 rounded-lg ' : '' )+(viewMode == 'grid' ? 'flex-col' : 'flex-row' ) } onClick={clickFunc}>
			<IconByType fileType={file.file_type} className={"z-50 p-2 mx-auto w-12 md:w-24 rounded-lg " + ( active ? 'bg-green-200 shadow-lg ' : 'bg-gray-100 ' ) + (viewMode == 'grid' ? 'w-16 md:w-24 m-2' : 'w-20 md:w-36' )} />
			
			<p className={"my-auto z-50 w-full underline p-4 "+ ( active ? ' text-white ' : ' text-gray-800  ' ) + (viewMode == 'grid' ? 'text-center' : 'text-left' )}>{file.user_file_name }</p>
			
			<div className="flex mx-auto justify-center items-center text-xs mb-4 space-x-3 flex-nowrap px-3">
				{ tags }
			</div>

			<p className={"text-right my-auto mx-auto z-50 w-full p-4 hidden md:block" + (viewMode == 'grid' ? 'hidden' : '' ) + ( active ? ' text-white ' : ' text-gray-800 ' ) }>{'Last Modified: ' +  new Date(file.last_modified).toLocaleDateString() }</p>
		</div>
	)
}

export default FileComponent