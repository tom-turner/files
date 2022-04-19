import { useState, useEffect } from "react";
import IconByType from '../IconByType'

let FileComponent = (props) => {
	let [ active, setActive ] = useState(false)
	let [ clicked, setClicked ] = useState(false)
	let fileType = props.file.file_type

	let clickFunc = () => {
	  if(clicked){
        return window.location.href = '/file:/'+props.file.id
      }
      setClicked(true)
      setTimeout(() => {
        setClicked(false)
      },350)

      if(active){
      	setActive(false)
      	props.setSelectedFiles([])
      } else{
      	setActive(true)
      	props.setSelectedFiles([ ...props.selectedFiles ,props.file])
      }
	}

	let dragFunc = (e) => {
		setActive(true)
      	props.setSelectedFiles([ ...props.selectedFiles, props.file])
	}
	
	return (
		<div draggable="true" onDragStart={dragFunc} className={"relative flex overflow-hidden break-words cursor-pointer " + ( active ? ' bg-green-500 rounded-lg ' : '' )+(props.viewMode == 'grid' ? 'flex-col' : 'flex-row' ) } onClick={clickFunc}>
			<IconByType fileType={props.file.file_type} className={"z-50 p-2 mx-auto w-12 md:w-24 rounded-lg " + ( active ? 'bg-green-200 shadow-lg ' : 'bg-gray-100 ' ) + (props.viewMode == 'grid' ? 'w-16 md:w-24 m-2' : 'w-20 md:w-36' )} />
			<p className={"my-auto z-50 w-full underline p-4 "+ ( active ? ' text-white ' : ' text-gray-800  ' ) + (props.viewMode == 'grid' ? 'text-center' : 'text-left' )}>{props.file.user_file_name }</p>
			<p className={"text-right my-auto mx-auto z-50 w-full p-4 hidden md:block" + (props.viewMode == 'grid' ? 'hidden' : '' ) + ( active ? ' text-white ' : ' text-gray-800 ' ) }>{'Last Modified: ' +  new Date(props.file.last_modified).toLocaleDateString() }</p>
		</div>
	)
}

export default FileComponent