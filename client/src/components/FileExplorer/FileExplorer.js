import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { deleteFile, deleteDir, getFiles } from '../../lib/api'
import CreateDirectory from "./CreateDirectory"
import FileUpload from "./FileUpload"
import Header from "./Header"
import Actions from "./Actions"
import ServerCheck from "../ServerCheck"

const DirectoryLink = ({ to, name, className }) => (
  <Link className={"my-auto p-2 text-left " + className} to={to}>{name}</Link>
)

let FileExplorer = ({ path }) => {
  const [ files, setFiles ]= useState([])
  const [ dirs, setDirs ]= useState([])
  const [ selectedFileName, setSelectedFileName ]= useState(null)
  const [ selectedFileId, setSelectedFileId ]= useState(null)
  const [ linkUrl, setLinkUrl ]= useState(null)

  useEffect( () => {
    ;(async () => {
      let result = await getFiles(path)
      setFiles(result.files)
      setDirs(result.dirs)
      return
    })()
  }, [path]);

  const listFiles = files.map((file) => {
    let clicked = 0
    return (<div className={"w-full border rounded-lg justify-between flex flex-col p-4 mx-auto h-40 cursor-pointer"} onClick={
      () => {
        if(clicked > 0){
          return window.location.href = '/file:/'+file.id
        }
        clicked ++
        setTimeout(() => {
          clicked = 0
        },1000)
        setSelectedFileName(file.user_file_name)
        setSelectedFileId(file.id)
        setLinkUrl('/file:/'+file.id)
        
      }
    }>
      <p>{file.user_file_name}</p>
    </div>
    )
  });

  const listDirs = dirs.map((file) =>
    <div className="w-full bg-gray-200 rounded flex flex-col p-4 mx-auto">
      <DirectoryLink to={ file.user_file_path + file.user_file_name } name={file.user_file_name}/>
    </div>
  );

  return (
    <div className="w-full mx-auto flex flex-col">
      <ServerCheck />
      <Header />
      
      <div className="px-6">
        <Actions fileName={selectedFileName} fileId={selectedFileId} to={linkUrl} />
        <div className="w-full grid grid-cols-6 gap-2">
          {listFiles}
        </div>
      </div>

    </div>
  )
}

export default FileExplorer;
