import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { deleteTag, getTagById, getSharedTagsByUser, getShareByTagId } from "../lib/api"
import { Dropdown, DropdownItem } from './Dropdown.js'
import { ReactComponent as Plus }  from '../assets/plus.svg';
import { ReactComponent as Menu }  from '../assets/menu.svg';
import { ReactComponent as Back }  from '../assets/dropdown-arrow.svg';
import { UserAvatar } from "./User"
import { EditSharing } from "./Modals"
import Search from "../components/Search"
import { CreateSharedTag } from "../components/Modals"

export function TagTitle({ tag }) {
  let navigate = useNavigate()
  let [ shareModal, setShareModal ] = useState(false)

  if(!tag)
    return

  return (
    <div style={{backgroundColor: tag.tag_colour}} className="p-6 flex justify-between text-white">
      <div className="flex space-x-3">
        <Back onClick={ () => navigate(-1)} className="my-auto h-12 rotate-90 fill-white" />
        <p className="text-3xl font-bold my-auto">{tag.tag_name}</p>
      </div>
      <Dropdown title="" img={Menu} style={{ outer: `my-auto`, inner:'', img: '' }}>
        <DropdownItem title='Sharing' onClick={ () => { setShareModal(true) }} /> 
        <DropdownItem title='Download' onClick={ () => { }} /> 
        <DropdownItem title='Delete' onClick={ () => { deleteTag(tag); navigate(-1) }} />
        <DropdownItem title='Rename' onClick={ () => { }} />
      </Dropdown>
      { shareModal && <EditSharing tag={tag} dismount={ () => setShareModal(false) } /> }
    </div>
  )
}

export function PublicTagTitle({ tag, permissions }) {
  let navigate = useNavigate()

  if(!tag)
    return

  return (
    <div style={{backgroundColor: tag.tag_colour}} className="p-6 flex justify-between text-white">
      <div className="flex space-x-3">
        <p className="text-3xl font-bold my-auto">{tag.tag_name}</p>
      </div>
      <Dropdown title="" img={Menu} style={{ outer: `my-auto`, inner:'', img: '' }}>
        { permissions.download && <DropdownItem title='Download' onClick={ () => { }} /> }
      </Dropdown>
    </div>
  )
}

export function TagsList({tags, className, onClick}){
  let navigate = useNavigate()

  if(!tags)
    return

  let tagsList = tags.map((tag, i) => {
    tag.name = tag.tag_name
    tag.colour = tag.tag_colour
    return <TagButton key={i} tag={tag} className="w-32" onClick={ (e) => { onClick(tag.id) }}  />
  })

  return (
    <div className={`flex overflow-x-scroll overflow-y-hidden max-h-32 flex-shrink-0 w-full space-x-3 font-bold ${className}`}>
      {tagsList}
    </div>
  )
}

export function TagButton({tag, className, onClick}){
  let navigate = useNavigate();
  let [ users, setUsers ] = useState(null)

  if(!tag)
    return 

  return (
    <div onClick={onClick} className={`flex-shrink-0 rounded-xl overflow-hidden text-white cursor-pointer bg-stone-800 hover:scale-110 border border-stone-900 shadow-md ${className}`}> 
      <p style={{backgroundColor: tag.tag_colour}} className="px-3 py-1 truncate">{tag.tag_name}</p>

      <div className="flex p-1 overflow-hidden">
        <UserAvatar className="w-10 fill-white " />
      </div>
    </div>
  )
}

export function TagBar({tags, className, onClick}) {
  let navigate = useNavigate();
  let [ searchQuery, setSearchQuery] = useState(null)
  let [ newShareModal, setNewShareModal ] = useState(false)

  let tagsList = tags.map((tag, i) => {
    let match = tag.tag_name.toLowerCase().includes( searchQuery ? searchQuery.toLowerCase() : tag.tag_name.toLowerCase() ) 
    if(match)
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
      { newShareModal && <CreateSharedTag dismount={ () => setNewShareModal(false) } /> }
    </div>
  )
}
