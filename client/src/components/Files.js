import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IconByType from './IconByType'
import Navbar from "./Navbar"


export function Files({ files, onClick }) {
  let FileComponent = ({file}) => {
    return (
      <div draggable="true" onDragStart={() => {}} className={"relative flex overflow-hidden break-words cursor-pointer flex-row " } onClick={() => { onClick(file.id) } }>
        <IconByType filetype={file.file_type} className={"mx-auto w-12 md:w-24 rounded-lg w-20 md:w-36 "} />
        
        <p className={"my-auto w-full underline px-4 text-left "}>{file.user_file_name }</p>
        
        <p className={"text-right my-auto mx-auto w-full p-4 hidden md:block"}>{'Last Modified: ' +  new Date(file.last_modified).toLocaleDateString() }</p>
      </div>
    )
  }

  if(!files)
    return 

  const listFiles = files.map((file) => {
    return (
      <FileComponent key={file.id} file={file} />
    )
  });

  return( 
      <div className={"flex flex-col text-white space-y-3"}>
        {listFiles}
      </div>
  )
}

export function FileSelector({ files, selectedFiles, setSelectedFiles, className}) {
  let FileComponent = ({file}) => {
    let selected = selectedFiles.includes(file)
    return (
      <div onClick={ () => setSelectedFiles(file) } draggable="true" onDragStart={() => {}} className={`relative flex overflow-hidden break-words cursor-pointer flex-row` } >
        <IconByType filetype={file.file_type} className={"mx-auto w-12 md:w-24 rounded-lg md:w-36 "} />    
        <p className={"my-auto w-full underline px-4 text-left "}>{file.user_file_name }</p>
        <p className={"text-right my-auto mx-auto w-full p-4 hidden md:block"}>{'Last Modified: ' +  new Date(file.last_modified).toLocaleDateString() }</p>
        <div className="flex justify-center">
          { selected && <div className="bg-green-500 rounded-full w-4 h-4 border border-stone-700 my-auto"></div> }
        </div>
      </div>
    )
  }

  if(!files)
    return 

  const listFiles = files.map((file) => {
    
    return (
      <FileComponent key={file.id} file={file} />
    )
  });

  return( 
      <div className={`flex flex-col space-y-3 rounded-xl ${className}`}>
        {listFiles}
      </div>
  )
}

