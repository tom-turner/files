import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import {ReactComponent as Avatar}  from '../assets/avatar.svg';
import {ReactComponent as SearchIcon}  from '../assets/searchicon.svg';
import { AuthenticationContext } from "../context/withAuthentication"
import { Dropdown, DropdownItem } from './Dropdown'


import {ReactComponent as Home}  from '../assets/home.svg';
import {ReactComponent as Plus}  from '../assets/plus.svg';
import {ReactComponent as Tags}  from '../assets/add-tag.svg';
import {ReactComponent as Chat}  from '../assets/chat.svg';

import {UploadProgress, FileUpload, FolderUpload, NewSharedUpload} from "./Modals"; 


let NavbarItem = ({text, Icon, fn, selected}) => {
  return (
    <div onClick={fn} className={`flex p-2 w-14 h-14 cursor-pointer aspect-square hover:rounded-xl items-center justify-center hover:scale-110 ${selected ? 'rounded-xl bg-indigo-500 scale-110' : ' hover:bg-indigo-500 bg-stone-900 rounded-full '}`}>
      { text && <div className="p-1 overflow-hidden">
        <p className="text-sm text-center text-white font-bold"> {text} </p>
      </div> }
      { Icon && <Icon className="fill-white p-2" /> }
    </div>
  )
}

let NavbarActionButton = () => {
  let navigate = useNavigate();
  let [ newShareModal, setNewShareModal ] = useState(false)
  let [ fileUploadModal, setFileUploadModal ] = useState(false)
  let [ folderUploadModal, setFolderUploadModal ] = useState(false)

  return (
    <div>
      <Dropdown title="" img={Plus} style={{ outer: 'bg-stone-900 hover:bg-indigo-500 p-2 rounded-full hover:rounded-xl', inner:'', img: '' }}>
        <DropdownItem title='New Share' onClick={ () => { setNewShareModal(true)} } />
        <DropdownItem title='Upload Files' onClick={ (e) => { setFileUploadModal(true) }} />
        <DropdownItem title='Upload Folder' onClick={ (e) => { setFolderUploadModal(true) }} />
      </Dropdown>
      { newShareModal && <NewSharedUpload dismount={ () => { setNewShareModal(false); navigate('/sharing') } } /> }
      { fileUploadModal && <FileUpload dismount={ () => { setFileUploadModal(false); navigate('/') } } /> }
      { folderUploadModal && <FolderUpload dismount={ () => { setFolderUploadModal(false); navigate('/') } } /> }
    </div>
  )
}

let Profile = () => {
  const { logout } = useContext(AuthenticationContext)
  let navigate = useNavigate();
  let path = window.location.pathname

  return (
    <Dropdown title="" img={Avatar} style={{ outer: `bg-stone-900 hover:bg-indigo-500 p-2 rounded-full hover:rounded-xl ${path === '/my-account' ? 'rounded-xl bg-indigo-500' : ' hover:bg-indigo-500 rounded-full '}`, inner:'', img: '' }}>
      <DropdownItem title='My Account' onClick={ () => { navigate('/my-account') }} />
      <DropdownItem title='Logout' onClick={logout} />
    </Dropdown>
  )
}

let Navbar = () => {
  let navigate = useNavigate();
  let path = window.location.pathname


  return (
      <div className="flex min-h-screen">
        <div className="flex flex-col bg-stone-800 p-3 space-y-3">

          <Profile />
          <div className="bg-stone-600 h-[0.15rem] rounded-full"></div>
          <div className="flex flex-col space-y-3 text-xl">
            <NavbarItem Icon={Home} selected={ path === '/' } fn={ () => { navigate('/')}} />
            <NavbarItem Icon={Chat} selected={ path.includes('/sharing') } fn={ () => { navigate('/sharing')}} />
            <NavbarActionButton />
          </div>

        </div>
      </div>
  )
}

export default Navbar;
