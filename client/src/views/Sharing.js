import { getFilesByTag, getTagById, getSharedTagsByUser } from "../lib/api"
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar"
import Search from "../components/Search"
import { NewSharedTag } from "../components/Modals"
import { Files } from '../components/Files'
import { TagTitle, TagButton } from '../components/Tags'
import { ReactComponent as Plus }  from '../assets/plus.svg';
import { Tag } from './Tags'


export function SharedFilesRoot() {
  return (
    <div className="flex">
      <Navbar />
      <SharedTagsNavbar />
      <div className="flex flex-col max-h-screen overflow-scroll flex-grow bg-stone-800 text-white">
      </div>
    </div>
  )
}

export function SharedFilesTag() {
  return (
    <div className="flex">
      <Navbar />
      <SharedTagsNavbar />
      <div className="flex flex-col max-h-screen overflow-scroll flex-grow bg-stone-800 text-white">
        <SharedTagView />
      </div>
    </div>
  )
}

export function SharedTagView() {
  let id = useParams()['id']
  let [ files, setFiles ] = useState([])
  let [ tag, setTag ] = useState(null)

  useEffect( () => {
    ( async () => {
      setFiles( await getFilesByTag(id) )
      setTag( await getTagById(id) )
    } )()
  },[id])

  
  return (
    <div className="flex flex-col space-y-6">
      <TagTitle tag={tag} />
      <Files files={files} />
    </div>
  )
}

export function SharedTagsNavbar() {
  let navigate = useNavigate();
  let id = useParams()['id']
  let [ searchQuery, setSearchQuery] = useState(null)
  let [ tags, setTags ] = useState([])
  let [ newShareModal, setNewShareModal ] = useState(false)

  useEffect( () => {
    ( async () => {
      let response = await getSharedTagsByUser()
      setTags( response.filter( item => item.tag_name.toLowerCase().includes( searchQuery ? searchQuery.toLowerCase() : item.tag_name.toLowerCase()) )  )
    } )()
  },[searchQuery])

  let tagsList = tags.map( (tag, i) => {
    return <TagButton key={i} tag={tag} onClick={ () => { navigate(`/sharing/${tag.id}`) }} />
  })

  return (
    <div className="flex max-h-screen bg-stone-900 overflow-scroll">
      <div className="flex flex-col h-full p-6">
        <Search className="pt-3" fn={ (e) => { setSearchQuery(e) }} />
        <div className="flex flex-col space-y-3 font-bold py-6 w-64">
          {tagsList}
          <div onClick={() => { setNewShareModal(true) }} className="rounded-xl overflow-hidden text-white flex justify-center cursor-pointer bg-stone-800 hover:scale-110"> 
            <Plus className="fill-stone-500 w-6 h-6 p-1" />
          </div>
        </div>
      </div>
      { newShareModal && <NewSharedTag dismount={ () => setNewShareModal(false) } /> }
    </div>
  )
}


