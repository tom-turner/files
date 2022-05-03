import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import { deleteFile, deleteDir, getFiles } from '../../lib/api'
import UploadProgress from "./UploadProgress"
import { uploadFile, uploadFiles, searchFiles, getSharedFiles } from "../../lib/api"
import useStickyState from "../../lib/useStickyState"
import Header from "./Header"
import Actions from "./Actions"
import FileComponent from "./FileComponent"
import TagComponent from "./TagComponent"
import ServerCheck from "../ServerCheck"
import { useParams } from "react-router-dom";
import { AuthenticationContext } from "../../lib/withAuthentication"
import {ReactComponent as Delete}  from '../../assets/delete.svg';
import IconByType from '../IconByType'
import { Error } from "../Alerts"


export function FileExplorer() {
  const params = useParams()
  const path = params['*']
  const query = window.location.search
  const [ viewType, setViewType ]= useState(null)
  const [ files, setFiles ]= useState([])
  const [ dirs, setDirs ]= useState([])
  const [ tags, setTags ]= useState([])
  const [ selectedFiles, setSelectedFiles ] = useState([])
  const [ selectedTag, setSelectedTag ] = useState({})
  const [ viewMode, setViewMode]= useStickyState('grid', 'viewMode')
  const [ progress, setProgress ] = useState(0)
  const [ uploadError, setUploadError ] = useState(null)
  const { logout } = useContext(AuthenticationContext)
  const refresh = async () => {
    let result = await getFiles(path)
    console.log(result)
    setSelectedFiles([])
    setSelectedTag({})
    setFiles(result.files)
    setDirs(result.dirs)
    setTags(result.tags)
  }
  const search = async (e) => {
    let result = await searchFiles(e, path)
    setSelectedFiles([])
    setSelectedTag({})
    setFiles(result.files)
    setDirs(result.dirs)
    setTags(result.tags)
  }

  useEffect( () => { refresh() } , [path]);

  let handleFileUpload = (event, callback) =>{
    let files = event.target.files

    if(files.length === 0)
      return

    setProgress({message:'Upload starting'})
    uploadFiles(files, async (e) => {
      if(e.error){
        alert(e.error)
        setUploadError(e.error)
      }
      setProgress({percent: e.progress, message:`${ Math.round(e.progress * 100) / 100}% done`})
      if(e.success){
        setProgress({message:'Finishing up'})
        refresh()
        setProgress(0)
      }
     
    })
  }

  let handleDrop = (e) => {
    e.target = e.dataTransfer
    e.preventDefault()
    handleFileUpload(e)
  }

  const listFiles = files.map((file) => {
    return (
      <FileComponent file={file} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} className={''} viewMode={viewMode} setSelectedTag={setSelectedTag}   />
    )
  });

  const listTags = tags.map((tag) => {
    return (
      <TagComponent tag={tag} selectedTag={selectedTag} setSelectedTag={setSelectedTag} setSelectedFiles={setSelectedFiles} search={search}  />
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
      <Header search={search} />
      <div className="flex-grow px-6 py-3 flex flex-col space-y-6">
        <Actions selectedFiles={selectedFiles} selectedTag={selectedTag} setViewMode={setViewMode} viewMode={viewMode} handleFileUpload={handleFileUpload} refresh={refresh} />
        <div className="flex space-x-3">
          {listTags}
        </div>
        <div className={"w-full grid " + ( viewMode == "list" ? "gap-1 grid-cols-1" : "gap-6 grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7")}>
          {listDirs}
          {listFiles}
          <UploadProgress progress={progress} error={uploadError} viewMode={viewMode} />
        </div>
      </div>

      <ServerCheck />

    </div>
  )
}

export function SharedFileExplorer() {
  const params = useParams()
  const navigate = useNavigate();
  const slug = params['slug']
  const [ error, setError ] = useState(null)
  const [ files, setFiles ] = useState([])
  const [ selectedFiles, setSelectedFiles ] = useState([])
  const [ selectedTag, setSelectedTag ] = useState({})
  const [ viewMode, setViewMode]= useStickyState('list', 'viewMode')
  const getFiles = async () => {
    let result = await getSharedFiles(slug)

    if(result.error)
      setError(result.error)

    if(result.files)
      setFiles(result.files)
  }

  useEffect(() => { getFiles() } ,[slug])

  if(error)
    return (
      <Error error={error} />
    )

  const listFiles = files.map((file) => {
    console.log(file)
    return (
    <div className={"relative flex overflow-hidden break-words cursor-pointer " + ( viewMode == 'grid' ? 'flex-col' : 'flex-row' ) } onClick={ () => { navigate(`/share/${slug}/${file.id}`) } }>
      <IconByType fileType={file.file_type} className={"z-50 p-2 mx-auto w-12 md:w-24 rounded-lg " + (viewMode == 'grid' ? 'w-16 md:w-24 m-2' : 'w-20 md:w-36' )} />
      
      <p className={"my-auto z-50 w-full underline px-4 " + (viewMode == 'grid' ? 'text-center' : 'text-left' )}>{file.user_file_name }</p>
      
      <p className={"text-right my-auto mx-auto z-50 w-full p-4 hidden md:block" + (viewMode == 'grid' ? 'hidden' : '' ) }>{'Last Modified: ' +  new Date(file.last_modified).toLocaleDateString() }</p>
    </div>
  )
  });

  return (
    <div className="w-full relative min-h-screen overflow-scroll mx-auto flex flex-col">
      <div className="flex-grow px-6 py-3 flex flex-col space-y-6">
        <p className="font-bold text-2xl text-center"> Shared Files </p>
        <div className={"w-full grid " + ( viewMode == "list" ? "gap-1 grid-cols-1" : "gap-6 grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7")}>
          {listFiles}
        </div>
      </div>
    </div>
  )


}
