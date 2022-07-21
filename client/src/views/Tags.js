import { getFilesByTag, getTagById, deleteFiles, createTagFileJoinByTagId } from "../lib/api"
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar"
import { Files } from '../components/Files'
import { TagTitle, TagsList } from '../components/Tags'
import { TagActionsBar } from '../components/Actions'
import Search from "../components/Search"
import { FileSelector } from "../components/Files"


export function Tag() {
  let id = useParams()['id']
  let [ searchQuery, setSearchQuery] = useState(null)
  let [ tag, setTag ] = useState([])
  let [ childTags, setChildTags ] = useState([])
  let [ files, setFiles ] = useState([])
  let [selectActive, setSelectActive] = useState(false)
  let [selectedFiles, setSelectedFiles] = useState([])

  useEffect( () => {
    ( async () => {
      let response = await getFilesByTag(id)
      setFiles( response.filter( file => file.user_file_name.includes(searchQuery || file.user_file_name) ) )
      setTag( await getTagById(id) )
    } )()
  },[id, searchQuery])

  let handleSelectedFiles = (file) =>{
    if(selectedFiles.includes(file))
      return setSelectedFiles( selectedFiles.filter( e => { return e !== file } ) )
    else
      return setSelectedFiles([...selectedFiles, file])
  }
  
  return (
      <div className="flex flex-col flex-grow bg-stone-800">
        <TagTitle tag={tag} />
        
        <div className="flex p-3 space-y-3 flex-col max-h-screen overflow-scroll flex-grow bg-stone-800">
          <Search fn={ (e) => { setSearchQuery(e) } } />
          <TagActionsBar 
          requestDelete={ () => { deleteFiles(selectedFiles); setSelectActive(false) } } 
          requestShare={ () => { setSelectActive(false) } } 
          selectActive={selectActive} 
          setSelectActive={setSelectActive}
          setFileData={data => { createTagFileJoinByTagId([data], tag.id) }}
          />
        { childTags.length > 0 && <TagsList tags={childTags} /> }
        { selectActive ? 
          <FileSelector 
            files={files} 
            selectedFiles={selectedFiles} 
            setSelectedFiles={handleSelectedFiles} 
          /> 
          : <Files files={files} /> 
        }
        </div>
      </div>
  )
}

export function TagView(){
  return (
    <div className="flex">
      <Navbar />
      <Tag />
    </div>
  )
}