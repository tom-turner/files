import { useState, useEffect } from "react";
import {ReactComponent as FileIcon}  from './assets/fileicon.svg';

let ActiveBackground = ({ active }) => {
	return (
		<div>
			<div className={"absolute z-10 left-0 top-0 flex w-48 h-96 bg-indigo-500 animate-[spin_20s_linear_infinite] blur-2xl " + ( active ? '' : 'hidden' )}></div>
			<div className={"absolute z-0 right-0 top-0 flex  w-96 h-96 bg-green-500 animate-[spin_30s_linear_infinite] blur-2xl " + ( active ? '' : 'hidden' )}></div>
		</div>
	)
}

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
      	props.setSelectedFiles([props.file])
      }
	}
	
	return (
		<div className={"relative bg-gray-100 overflow-hidden shadow-md break-words rounded-lg border cursor-pointer"} onClick={clickFunc}>
			<ActiveBackground active={active} />
			<div className="z-50 flex items-center justify-center">
				<FileIcon className={"z-50 p-2 w-12 sm:w-16 md:w-20 " + ( active ? 'fill-white' : 'fill-gray-800' )} />
			</div>
			<div className="flex h-full w-full bg-white z-50 rounded-lg overflow-hidden">	
				<p className={"z-50 w-full font-bold text-white underline p-2 "+ ( active ? 'bg-indigo-500' : 'bg-green-500' ) }>{props.file.user_file_name}</p>
			</div>
		</div>
	)
}

export default FileComponent