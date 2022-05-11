import { useState, useEffect } from "react";
import { uploadFiles, getFiles } from "../../lib/api"
import useStickyState from "../../lib/useStickyState"
import Header from "./Header"
import Actions from "./Actions"
import { Files } from "./Files"
import { Tags } from "./Tags"
import ServerCheck from "../ServerCheck"
import { useParams } from "react-router-dom";
import { Popup } from "../Popup"
import { Loading, Error } from "../Alerts"

export function FileExplorer() {
  const params = useParams()
  const path = params['*']
  const [ viewMode, setViewMode ] = useStickyState('grid', 'viewMode')
  const [ data, setData ] = useState(null)
  const [ selectedFiles, setSelectedFiles ] = useState([])
  const [ selectedTag, setSelectedTag ] = useState(null)
  const [ progress, setProgress ] = useState(0)
  const [ popupContent, setPopupContent ] = useState(null)
  const updateData = async (e) => {
    let result = await getFiles( e || '' , path)
    setData(result)
    setSelectedFiles([])
    setSelectedTag(null)
    setPopupContent(null)
  }

  useEffect( () => { updateData() } , [path]);

  if(!data) {
    return <Loading />
  }

  if(data.error)
    return <Error error={data.error} />

  let handleFileUpload = (event) =>{
    let files = event.target.files
    if(files.length === 0)
      return

    setProgress({message:'Upload starting'})
    uploadFiles(files, async (e) => {
      if(e.error){
        alert(e.error)
        setProgress({ error: e.error })
      }
      setProgress({percent: e.progress, message:`${ Math.round(e.progress * 100) / 100}% done`})
      
      if(e.success){
        setProgress({message:'Finishing up'})
        updateData()
        setProgress(0)
      }
     
    })
  }

  let handleFileClick = (e) => {
      let type = e.file ? 'file' : e.tag ? 'tag' : null

      if(e.clicked){
        return window.location.href = '/file:/'+ e.file.id
      }
      if(e.active){
        setSelectedFiles(selectedFiles.filter((obj)=>{
          return obj.id !== e.file.id
        }))
      } else {
        setSelectedFiles([ ...selectedFiles , e.file])
      }
  }

  let handleTagClick = (e) => {
      setSelectedFiles([])
      if(e.clicked){
        return updateData(e.tag.tag_name)
      }
      if(e.active){
        setSelectedTag({})
      } else {
        setSelectedTag(e.tag)
      }
  }


  let handleDrop = (e) => {
    e.target = e.dataTransfer
    e.preventDefault()
    handleFileUpload(e)
  }

  

  return (
    <div onDragOver={ (e) => e.preventDefault() } onDrop={ (e) => handleDrop(e) } className="w-full relative min-h-screen max-h-screen overflow-clip mx-auto flex flex-col">
      <Header search={updateData} />
      <Actions selectedFiles={selectedFiles} selectedTag={selectedTag} setViewMode={setViewMode} viewMode={viewMode} handleFileUpload={handleFileUpload} refresh={updateData} setPopupContent={setPopupContent} />
      <Tags data={data} selectedTag={selectedTag} handleTagClick={handleTagClick} search={updateData} />
      <Files data={data} selectedFiles={selectedFiles} viewMode={viewMode} handleFileClick={handleFileClick} search={updateData} progress={progress} />
      <ServerCheck />
      <Popup content={popupContent} setPopupContent={setPopupContent} />
    </div>
  )
}