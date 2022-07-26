import { getFilesByTag, getTagById, removeTagFromFile, createTagFileJoin, getTagBySlug, getSharedFilesBySlug, getChildTags } from "../lib/api"
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar"
import { Files } from '../components/Files'
import { TagTitle, TagsList, PublicTagTitle } from '../components/Tags'
import { TagActionsBar, PublicTagActionsBar } from '../components/Actions'
import { FileSelector } from "../components/Files"


export function Tag() {
  let id = useParams()['tagId']
  let [ tag, setTag ] = useState(null)
  let [ files, setFiles ] = useState([])
  let [ childTags, setChildTags ] = useState([])

  useEffect( () => {
    ( async () => {
      let tag = await getTagById(id)
      setTag(tag)
      setFiles( await getFilesByTag(id) )
      setChildTags( await getChildTags(tag.id) )
    } )()
  },[id])

  return <TagLayout tag={tag} files={files} childTags={childTags} />
}


export function TagLayout({tag, childTags , files}) {  
  let navigate = useNavigate()
  let [selectActive, setSelectActive] = useState(false)
  let [selectedFiles, setSelectedFiles] = useState([])

  let handleSelectedFiles = (file) =>{
    if(selectedFiles.includes(file))
      return setSelectedFiles( selectedFiles.filter( e => { return e !== file } ) )
    else
      return setSelectedFiles([...selectedFiles, file])
  }
  
  return (
      <div className="flex flex-col flex-grow bg-stone-800 min-h-screen">
        <TagTitle tag={tag} />
        
        <div className="flex p-3 space-y-3 flex-col max-h-screen overflow-scroll flex-grow bg-stone-800">
          <TagActionsBar 
          requestDelete={ () => { removeTagFromFile(selectedFiles, tag.id); setSelectActive(false) } } 
          requestShare={ () => { setSelectActive(false) } } 
          selectActive={selectActive} 
          setSelectActive={setSelectActive}
          setFileData={data => { createTagFileJoin( data, tag.id) }}
          /> 
        { childTags.length > 0 && <TagsList tags={childTags} onClick={ (e) => { navigate(`/tag/${e}`) } } /> }
        { selectActive ? 
          <FileSelector 
            files={files} 
            selectedFiles={selectedFiles} 
            setSelectedFiles={handleSelectedFiles}
            className={'text-white'} 
          /> 
          : <Files files={files} onClick={ e => navigate(`/file/${e}`) } /> 
        }
        </div>
      </div>
  )
}


export function TagPublic({search, actions}) {
  let slug = useParams()['slug']
  let [ tag, setTag ] = useState(null)
  let [ files, setFiles ] = useState([])

  let permissions = {
    download:true,
    upload:false,
    delete:false
  }

  useEffect( () => {
    ( async () => {
      setTag( await getTagBySlug(slug) )
      setFiles( await getSharedFilesBySlug(slug) )
    } )()
  },[slug])

  return <TagLayoutPublic tag={tag} slug={slug} files={files} permissions={permissions}/>
}

export function TagLayoutPublic({tag, slug, files, permissions}) {  
  let navigate = useNavigate()
  let [ childTags, setChildTags ] = useState([])
  let [selectActive, setSelectActive] = useState(false)
  let [selectedFiles, setSelectedFiles] = useState([])

  let handleSelectedFiles = (file) =>{
    if(selectedFiles.includes(file))
      return setSelectedFiles( selectedFiles.filter( e => { return e !== file } ) )
    else
      return setSelectedFiles([...selectedFiles, file])
  }
  
  return (
      <div className="flex flex-col flex-grow bg-stone-800 min-h-screen">
        <PublicTagTitle tag={tag} isPublic={true} permissions={permissions} />
        <div className="flex p-3 space-y-3 flex-col max-h-screen overflow-scroll flex-grow bg-stone-800">
          <PublicTagActionsBar 
          selectActive={selectActive} 
          setSelectActive={setSelectActive}
          setFileData={data => { createTagFileJoin([data], tag.id) }}
          permissions={permissions}
          /> 
        { childTags.length > 0 && <TagsList tags={childTags} /> }
        { selectActive ? 
          <FileSelector 
            files={files} 
            selectedFiles={selectedFiles} 
            setSelectedFiles={handleSelectedFiles}
            className={'text-white'} 
          /> 
          : <Files files={files} onClick={ (e) => { navigate(`/public/${slug}/${e}`)} } /> 
        }
        </div>
      </div>
  )
}
