import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom"
import { deleteFile, deleteDir, getFiles } from '../../lib/api'
import UploadProgress from "./UploadProgress"
import { uploadFile, uploadFiles } from "../../lib/api"
import useStickyState from "../../lib/useStickyState"
import Header from "./Header"
import Actions from "./Actions"
import FileComponent from "./FileComponent"
import ServerCheck from "../ServerCheck"
import { useParams } from "react-router-dom";
import { AuthenticationContext } from "../../lib/withAuthentication"

let FileExplorer = () => {
  const params = useParams()
  const path = params['*']
  const [ viewType, setViewType ]= useState(null)
  const [ files, setFiles ]= useState([])
  const [ dirs, setDirs ]= useState([])
  const [ selectedFiles, setSelectedFiles ] = useState([])
  const [ viewMode, setViewMode]= useStickyState('grid', 'viewMode')
  const [ progress, setProgress ] = useState(0)
  const { logout } = useContext(AuthenticationContext)

  useEffect( () => {
    ;(async () => {
      let result = await getFiles(path)
      setFiles(result.files)
      setDirs(result.dirs)
      return
    })()
  }, [path]);

  let handleFileUpload = (event, callback) =>{
    let files = event.target.files
    uploadFiles(files, (e) => {
      if(e.error){
        alert(e.error.message)
      }
      if(e.success){
        window.location.reload()
      }
      setProgress(e.progress)
    })
  }

  let handleDrop = (e) => {
    e.target = e.dataTransfer
    e.preventDefault()
    handleFileUpload(e)
  }

  const listFiles = files.map((file) => {
    return (
      <FileComponent file={file} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} className={''} viewMode={viewMode}  />
    )
  });

  const listDirs = dirs.map((file) => {
    file.file_type = 'directory'
    return (
      ''
    )
  });

  return (
    <div onDragOver={ (e) => e.preventDefault() } onDrop={ (e) => handleDrop(e) } className="w-full relative min-h-screen overflow-scroll mx-auto flex flex-col">
      <Header />
      <div className="flex-grow px-6 py-3 flex flex-col space-y-6">
        <Actions selectedFiles={selectedFiles} setViewMode={setViewMode} viewMode={viewMode} handleFileUpload={handleFileUpload} />
        <div className={"w-full grid " + ( viewMode == "list" ? "gap-1 grid-cols-1" : "gap-6 grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7")}>
          {listDirs}
          {listFiles}
          <UploadProgress progress={progress} viewMode={viewMode} />
        </div>
      </div>

      <ServerCheck />

    </div>
  )
}

export default FileExplorer
