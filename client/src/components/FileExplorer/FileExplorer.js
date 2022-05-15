import { Component } from "react";
import { uploadFiles, getFiles } from "../../lib/api"
import Header from "./Header"
import Actions from "./Actions"
import { Files } from "./Files"
import { Tags } from "./Tags"
import ServerCheck from "../ServerCheck"
import { Popup } from "../Popup"
import { Loading, Error } from "../Alerts"

class FileExplorer extends Component {
  constructor(props){
    super(props)
    this.state = {
      viewMode: window.localStorage.getItem('viewMode') || 'grid',
      data: null,
      selectedFiles: [],
      selectedTag: {},
      uploadProgress: 0,
      popupContent: null,
      setViewMode: (e) => this.setViewMode(e),
      setData: (e) => this.setData(e),
    }
    this.setData()
  }

  setViewMode(event){
    this.setState({ viewMode: event })
    window.localStorage.setItem('viewMode', event )
  }

  async setData(event) {
    this.setState({ data: await getFiles( event || '') })
    this.setState({ selectedFiles: [] })
    this.setState({ selectedTag: {} })
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

  handleFileClick(e) {
    this.setState({ selectedTag: {} })
    if(e.clicked){
      return window.location.href = ('/file:/'+ e.file.id)
    }
    if(e.active){
      this.setState({
        selectedFiles : this.state.selectedFiles.filter((obj)=>{
          return obj.id !== e.file.id
        })
      })
    } else {
      this.setState({ selectedFiles : [ ...this.state.selectedFiles , e.file] })
    }
  }

  handleTagClick(e) {
      this.setState({ selectedFiles : [] })
      if(e.clicked){
        return this.setData(e.tag.tag_name)
      }
      if(e.active){
        this.setState({ selectedTag : {} })
      } else {
        this.setState({ selectedTag : e.tag })
      }    
  }

  render(){
    if(!this.state.data)
      return <Loading />
  
    if(this.state.data.error)
      return <Error error={this.state.data.error} />

    return (
      <div className="w-full relative min-h-screen max-h-screen overflow-clip mx-auto flex flex-col">
        <Header search={ (e) => this.setData(e) } />
        <Actions state={this.state} setState={ (e) => { this.setState(e) }} handleFileUpload={ (e) => this.handleFileUpload(e) } />
        <Tags state={this.state} setState={ (e) => { this.setState(e) }} handleTagClick={ (e) => this.handleTagClick(e) } />
        <Files state={this.state} setState={ (e) => { this.setState(e) }} handleFileClick={ (e) => this.handleFileClick(e) } />
        <ServerCheck />
        <Popup content={this.state.popupContent} setPopupContent={ (e) => this.setState({ popupContent: e }) } />
      </div>
    )
  }
}

export default FileExplorer
