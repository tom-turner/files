import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { deleteFile, deleteDir, getFiles } from '../../lib/api'
import CreateDirectory from "./CreateDirectory"
import UploadProgress from "./UploadProgress"
import { uploadFile, uploadFiles } from "../../lib/api"
import Header from "./Header"
import Actions from "./Actions"
import FileComponent from "./FileComponent"
import ServerCheck from "../ServerCheck"

let useStickyState = (defaultValue, key) => {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

let FileExplorer = ({ path }) => {
  const [ viewType, setViewType ]= useState(null)
  const [ files, setFiles ]= useState([])
  const [ dirs, setDirs ]= useState([])
  const [ selectedFiles, setSelectedFiles ]= useState([])
  const [ viewMode, setViewMode]= useStickyState('grid')
  const [ progress, setProgress ] = useState(0)

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
        window.location.reload()
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

  const listDirs = dirs.map((file) =>
    <div className="w-full bg-gray-200 rounded flex flex-col p-4 mx-auto">
      <FileComponent file={file} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} className={''} viewMode={viewMode}  />
    </div>
  );

  return (
    <div onDragOver={ (e) => e.preventDefault() } onDrop={ (e) => handleDrop(e) } className="w-full relative min-h-screen overflow-scroll mx-auto flex flex-col">
      <ServerCheck />
      <Header />
      <div className="px-6 py-3 flex flex-col space-y-3">
        <Actions selectedFiles={selectedFiles} setViewMode={setViewMode} viewMode={viewMode} handleFileUpload={handleFileUpload} />
        <div className={"w-full grid " + ( viewMode == "list" ? "gap-1 grid-cols-1" : "gap-6 grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7")}>
          {listDirs}
          {listFiles}
          <UploadProgress progress={progress} viewMode={viewMode} />
        </div>
      </div>

    </div>
  )
}

export default FileExplorer;
