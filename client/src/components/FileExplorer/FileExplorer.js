import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { deleteFile, deleteDir, getFiles } from '../../lib/api'
import CreateDirectory from "./CreateDirectory"
import FileUpload from "./FileUpload"
import { uploadFile, uploadFiles } from "../../lib/api"
import Header from "./Header"
import Actions from "./Actions"
import FileComponent from "./FileComponent"
import ServerCheck from "../ServerCheck"

const DirectoryLink = ({ to, name, className }) => (
  <Link className={"my-auto p-2 text-left " + className} to={to}>{name}</Link>
)

let handleDrop = (e) => {
  e.preventDefault()
  uploadFiles(e.dataTransfer.files)
}

let FileExplorer = ({ path }) => {
  const [ viewType, setViewType ]= useState(null)
  const [ files, setFiles ]= useState([])
  const [ dirs, setDirs ]= useState([])
  const [ selectedFiles, setSelectedFiles ]= useState([])
  const [ viewMode, setViewMode]= useState('grid')

  useEffect( () => {
    ;(async () => {
      let result = await getFiles(path)
      setFiles(result.files)
      setDirs(result.dirs)
      return
    })()
  }, [path]);

  const listFiles = files.map((file) => {
    return (
      <FileComponent file={file} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} className={''} viewMode={viewMode}  />
    )
  });

  const listDirs = dirs.map((file) =>
    <div className="w-full bg-gray-200 rounded flex flex-col p-4 mx-auto">
      <DirectoryLink to={ file.user_file_path + file.user_file_name } name={file.user_file_name}/>
    </div>
  );

  return (
    <div onDragOver={ (e) => e.preventDefault() } onDrop={ (e) => handleDrop(e) } className="w-full relative min-h-screen overflow-scroll mx-auto flex flex-col">
      <ServerCheck />
      <Header />
      
      <div className="px-6">
        <Actions selectedFiles={selectedFiles[0]} setViewMode={setViewMode} />
        <div className={"w-full grid " + ( viewMode == "list" ? "gap-1 grid-cols-1" : "gap-6 grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7")}>
          {listFiles}
        </div>
      </div>

    </div>
  )
}

export default FileExplorer;
