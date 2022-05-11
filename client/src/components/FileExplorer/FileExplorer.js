import { useState, useEffect, Component } from "react";
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

/*
export function FileExplorer() {
  const params = useParams()
  const path = params['*']
  const [ viewMode, setViewMode ] = useStickyState('grid', 'viewMode')
  const [ data, setData ] = useState(null)
  const [ selectedFiles, setSelectedFiles ] = useState([])
  const [ selectedTag, setSelectedTag ] = useState(null)
  const [ progress, setProgress ] = useState(0)
  const [ popupContent, setPopupContent ] = useState(null)
  const setData = async (e) => {
    let result = await getFiles( e || '' , path)
    setData(result)
    setSelectedFiles([])
    setSelectedTag(null)
    setPopupContent(null)
  }

  useEffect( () => { setData() } , [path]);

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
        setData()
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
        return setData(e.tag.tag_name)
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
      <Header search={setData} />
      <Actions selectedFiles={selectedFiles} selectedTag={selectedTag} setViewMode={setViewMode} viewMode={viewMode} handleFileUpload={handleFileUpload} refresh={setData} setPopupContent={setPopupContent} />
      <Tags data={data} selectedTag={selectedTag} handleTagClick={handleTagClick} search={setData} />
      <Files data={data} selectedFiles={selectedFiles} viewMode={viewMode} handleFileClick={handleFileClick} search={setData} progress={progress} />
      <ServerCheck />
      <Popup content={popupContent} setPopupContent={setPopupContent} />
    </div>
  )
}

*/

class FileExplorerTwo extends Component {
  constructor(props){
    super(props)
    this.state = {
      viewMode: 'grid',
      data : null,
      selectedFiles: null,
      selectedTag: null,
      uploadProgress: 0,
      popupContent: null,
    }
    this.setData()
  }


  async setData(event) {
    this.setState({ data: await getFiles( event || '') })
  }

  async handleFileUpload(event) {
    let files = event.target.files
    if(files.length === 0)
      return

    this.setState({ uploadProgress: { message:'Upload starting' } })
    uploadFiles(files, async (e) => {
      if(e.error){
        alert(e.error)
        this.setState({ uploadProgress: { error: e.error } })
      }
      this.setState({ uploadProgress: { percent: e.progress, message:`${ Math.round(e.progress * 100) / 100}% done`} })
      if(e.success){
        this.setState({ uploadProgress: {message:'Finishing up'} })
        this.setData()
        this.setState({ uploadProgress: 0 })
      }
    })
  }

  render(){
    if(!this.state.data)
      return <Loading />
  
    if(this.state.data.error)
      return <Error error={this.state.data.error} />

    return (
      <div className="w-full relative min-h-screen max-h-screen overflow-clip mx-auto flex flex-col">
        <Header search={ (e) => this.setData(e) } />
        <Actions state={this.state} setState={ (e) => { this.setState(e) }} handleFileUpload={ (e) => this.handleFileUpload(e) } setData={(e) => this.setData(e)} />
        <Files state={this.state} setState={ (e) => { this.setState(e) }} handleFileClick={handleFileClick} search={ (e) => this.setData(e) } />
      </div>
    )
  }
}

export default FileExplorerTwo
