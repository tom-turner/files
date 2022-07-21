import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { deleteTag, getTagById } from "../lib/api"
import { Dropdown, DropdownItem } from './Dropdown.js'
import { ReactComponent as Plus }  from '../assets/plus.svg';
import { ReactComponent as Menu }  from '../assets/menu.svg';
import { ReactComponent as Back }  from '../assets/dropdown-arrow.svg';
import { UserAvatar } from "./User"

export function TagTitle({ tag }) {
  let navigate = useNavigate()

  if(!tag)
    return

  return (
    <div style={{backgroundColor: tag.tag_colour}} className="p-6 flex justify-between text-white">
      <div className="flex space-x-3">
        <Back onClick={ () => navigate(-1)} className="my-auto h-12 rotate-90 fill-white" />
        <p className="text-3xl font-bold my-auto">{tag.tag_name}</p>
      </div>
      <Dropdown title="" img={Menu} style={{ outer: `my-auto`, inner:'', img: '' }}>
        <DropdownItem title='Delete' onClick={ () => { deleteTag(tag); navigate(-1) }} />
        <DropdownItem title='Rename' onClick={ () => { }} />
      </Dropdown>
    </div>
  )
}

export function TagsList ({tags, className}){
  let navigate = useNavigate()

  if(!tags)
    return

  let tagsList = tags.map((tag, i) => {
    tag.name = tag.tag_name
    tag.colour = tag.tag_colour
    return <TagButton key={i} tag={tag} className="w-32" onClick={ () => { navigate(`/tag/${tag.id}`)}} />
  })

  return (
    <div className={`flex space-x-3 font-bold w-full ${className}`}>
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
    <div onClick={onClick} className={`rounded-xl overflow-hidden text-white cursor-pointer bg-stone-800 hover:scale-110 border border-stone-900 shadow-md ${className}`}> 
      <p style={{backgroundColor: tag.tag_colour}} className="px-3 py-1 truncate">{tag.tag_name}</p>

      <div className="flex p-1 overflow-hidden">
        <UserAvatar className="w-10 fill-white " />
      </div>
    </div>
  )
}
