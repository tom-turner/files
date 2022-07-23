import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar"
import { getFiles, deleteFiles } from "../lib/api"
import { Files, FileSelector } from "../components/Files"
import { TagsList } from "../components/Tags"
import Search from "../components/Search"
import { ActionsBar } from "../components/Actions"


export function Home() {
  let navigate = useNavigate()
  let [searchQuery, setSearchQuery] = useState(null)
  let [files, setFiles] = useState(null)
  let [tags, setTags] = useState([])
  let [selectActive, setSelectActive] = useState(false)
  let [selectedFiles, setSelectedFiles] = useState([])

  useEffect( () => {
    ( async () => {
      let response = await getFiles(searchQuery || '')
      setFiles( response.files )
      setTags( response.tags )
    } )()
  },[searchQuery, selectActive])

  let handleSelectedFiles = (file) =>{
    if(selectedFiles.includes(file))
      return setSelectedFiles( selectedFiles.filter( e => { return e !== file } ) )
    else
      return setSelectedFiles([...selectedFiles, file])
  }

  return (
      <div className="flex py-6 px-3 space-y-3 flex-col max-h-screen overflow-scroll flex-grow bg-stone-800">
        <Search fn={(e) => setSearchQuery(e)} />
        <ActionsBar 
          requestDelete={ () => { deleteFiles(selectedFiles); setSelectActive(false) } } 
          requestShare={ () => { setSelectActive(false) } } 
          selectActive={selectActive} 
          setSelectActive={setSelectActive}
          dismount={ () => { }} // need to impliment dismount to reload files on action
          />
        { tags.length > 0 && <TagsList tags={tags} onClick={ (e) => { navigate(`/tag/${e}`) }} /> }
        { selectActive ? 
          <FileSelector 
            files={files} 
            selectedFiles={selectedFiles} 
            setSelectedFiles={handleSelectedFiles}
            className={'text-white'} 
          /> 
          : <Files files={files} onClick={ e => navigate(`/file/${e}`)} /> 
        }
      </div>
  )
}

