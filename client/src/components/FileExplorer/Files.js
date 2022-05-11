import { useState, useEffect } from "react";
import IconByType from '../IconByType'
import UploadProgress from "./UploadProgress"
import { Tag } from "./Tags.js"

export function FileComponent({file, selectedFiles, handleFileClick,  viewMode}){
	let [ active, setActive ] = useState(false)
	let [ clicked, setClicked ] = useState(false)

	useEffect(()=>{
			selectedFiles.find( obj => obj.id === file.id ) === undefined ? setActive(false) : setActive(true)
	},[selectedFiles])

	let handleClick = () => {
		handleFileClick({ file, clicked, active })
		setClicked(true)
    setTimeout(() => {
      setClicked(false)
    },350)
	}

	const tags = file.fileTags.map((tag) =>{
		if(!tag)
			return 

		return (
			<Tag key={tag.id} tag={tag} file={file} />
		)
	})

	return (
		<div draggable="true" onDragStart={() => {}} className={"relative flex overflow-hidden break-words cursor-pointer " + ( active ? ' bg-green-500 rounded-lg ' : '' )+(viewMode === 'grid' ? 'flex-col' : 'flex-row' ) } onClick={handleClick}>
			<IconByType filetype={file.file_type} className={"z-50 p-2 mx-auto w-12 md:w-24 rounded-lg " + ( active ? 'bg-green-200 shadow-lg ' : 'bg-gray-100 ' ) + (viewMode === 'grid' ? 'w-16 md:w-24 m-2' : 'w-20 md:w-36' )} />
			
			<p className={"my-auto z-50 w-full underline px-4 "+ ( active ? ' text-white ' : ' text-gray-800  ' ) + (viewMode === 'grid' ? 'text-center' : 'text-left' )}>{file.user_file_name }</p>
			
			<div className="flex my-auto justify-center items-center text-xs mb-4 space-x-3 flex-nowrap px-3">
				{ tags }
			</div>

			<p className={"text-right my-auto mx-auto z-50 w-full p-4 hidden md:block" + (viewMode === 'grid' ? 'hidden' : '' ) + ( active ? ' text-white ' : ' text-gray-800 ' ) }>{'Last Modified: ' +  new Date(file.last_modified).toLocaleDateString() }</p>
		</div>
	)
}


export function Files({ data, selectedFiles, selectedTag, viewMode, handleFileClick, search, progress}){
	let files = data.files

  const listFiles = files.map((file) => {
    return (
      <FileComponent key={file.id} file={file} selectedFiles={selectedFiles} viewMode={viewMode} handleFileClick={handleFileClick}  />
    )
  });

  return (
    <div className="overflow-y-scroll flex-grow px-3 sm:px-6 py-3 flex flex-col space-y-6 z-20">
        <div className={"w-full grid " + ( viewMode === "list" ? "gap-1 grid-cols-1" : "gap-6 grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7")}>
          {listFiles}
          <UploadProgress progress={progress} viewMode={viewMode} />
        </div>
    </div>
  )
}



