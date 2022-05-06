import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import UploadProgress from "./UploadProgress"
import { uploadFile, uploadFiles, getFiles, getSharedFiles, deleteFile, deleteDir } from "../../lib/api"
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
import { Popup } from "../Popup"

export function Tags({tags, selectedTag, setSelectedTag, setSelectedFiles, search}){
  const listTags = tags.map((tag) => {
    return (
        <TagComponent tag={tag} selectedTag={selectedTag} setSelectedTag={setSelectedTag} setSelectedFiles={setSelectedFiles} search={search} />
    )
  });

  return (
    <div className="my-auto flex px-1 space-x-1 max-w-1/2 overflow-x-clip z-20">
      {listTags}
    </div>
  )
}

export function Files({files, dirs, setSelectedFiles, selectedFiles, selectedTag, viewMode, setSelectedTag, search, progress, uploadError}){

  const listFiles = files.map((file) => {
    return (
      <FileComponent file={file} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} className={''} viewMode={viewMode} setSelectedTag={setSelectedTag}   />
    )
  });

  const listDirs = dirs.map((file) => {
    file.file_type = 'directory'
    return (
      ''
    )
  });

  return (
    <div className="flex-grow px-6 py-3 flex flex-col space-y-6 z-20">
        <div className={"w-full grid " + ( viewMode == "list" ? "gap-1 grid-cols-1" : "gap-6 grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7")}>
          {listDirs}
          {listFiles}
          <UploadProgress progress={progress} error={uploadError} viewMode={viewMode} />
        </div>
    </div>
  )
}

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
  const [ popupContent, setPopupContent ] = useState(null)
  const updateFileList = async (e) => {
    let result = await getFiles( e || '' , path)
    setSelectedFiles([])
    setSelectedTag({})
    setFiles(result.files)
    setDirs(result.dirs)
    setTags(result.tags)
    setPopupContent(null)
  }

  useEffect( () => { updateFileList() } , [path]);

  let handleFileUpload = (event) =>{
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
        updateFileList()
        setProgress(0)
      }
     
    })
  }

  let handleDrop = (e) => {
    e.target = e.dataTransfer
    e.preventDefault()
    handleFileUpload(e)
  }

  let tagsList = <Tags tags={tags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} setSelectedFiles={setSelectedFiles} search={updateFileList} />

  return (
    <div onDragOver={ (e) => e.preventDefault() } onDrop={ (e) => handleDrop(e) } className="w-full relative min-h-screen overflow-clip mx-auto flex flex-col">
      <Header search={updateFileList} tagsList={tagsList} />
      <Actions className="px-6 py-3" selectedFiles={selectedFiles} selectedTag={selectedTag} setViewMode={setViewMode} viewMode={viewMode} handleFileUpload={handleFileUpload} refresh={updateFileList} setPopupContent={setPopupContent} />
      <Files files={files} dirs={dirs} setSelectedFiles={setSelectedFiles} selectedFiles={selectedFiles} viewMode={viewMode} setSelectedTag={setSelectedTag} search={updateFileList} progress={progress} uploadError={uploadError} />
      <ServerCheck />
      <Popup content={popupContent} setPopupContent={setPopupContent} />
    </div>
  )
}


