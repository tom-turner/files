import { useState, useEffect, useRef } from "react";
import { Files, FileSelector } from "../components/Files"
import { FileUpload, FolderUpload } from '../components/Modals'
import { Dropdown, DropdownSplit, DropdownItem } from '../components/Dropdown'
import {ReactComponent as UploadIcon}  from '../assets/upload.svg';
import {ReactComponent as Grid}  from '../assets/grid.svg';
import {ReactComponent as List}  from '../assets/list.svg';
import {ReactComponent as Menu}  from '../assets/menu.svg';
import {ReactComponent as Delete}  from '../assets/delete.svg';
import {ReactComponent as Select}  from '../assets/select.svg';

export function ViewSelector(){
  let [ viewMode, setViewMode ] = useState('grid')
  let [toggle, setToggle]= useState(viewMode === 'list' ? true : false)
  return (
    <DropdownSplit onClick={() => { setToggle(!toggle); setViewMode(toggle ? 'grid' : 'list') }} title='' img={ viewMode === 'list' ? List : Grid} >
      <DropdownItem title='Grid' onClick={ () => { setViewMode('grid') }} />
      <DropdownItem title='List' onClick={ () => { setViewMode('list') }}/>
    </DropdownSplit>
  )
}

export function FileUploader() {
  let [ fileUploadModal, setFileUploadModal ] = useState(false)
  let [ folderUploadModal, setFolderUploadModal ] = useState(false)
  return (
    <div>
      <DropdownSplit onClick={() => { setFileUploadModal(true)  }} title='Upload Files' img={UploadIcon} >
        <DropdownItem title='Upload Files' onClick={() => { setFileUploadModal(true) }} />
        <DropdownItem title='Upload Folder'onClick={() => { setFolderUploadModal(true) }} />
        <DropdownItem title='Create New Folder'onClick={() => {  }} />
      </DropdownSplit>
      { fileUploadModal && <FileUpload dismount={ () => { setFileUploadModal(false) } } /> }
      { folderUploadModal && <FolderUpload dismount={ () => { setFolderUploadModal(false) } } /> }
    </div>
  )
}

export function TaggedFileUploader({setFileData}) {
  let [ fileUploadModal, setFileUploadModal ] = useState(false)
  let [ folderUploadModal, setFolderUploadModal ] = useState(false)
  return (
    <div>
      <DropdownSplit onClick={() => { setFileUploadModal(true)  }} title='Upload Files' img={UploadIcon} >
        <DropdownItem title='Upload Files' onClick={() => { setFileUploadModal(true) }} />
        <DropdownItem title='Create New Folder'onClick={() => {  }} />
      </DropdownSplit>
      { fileUploadModal && <FileUpload dismount={ () => { setFileUploadModal(false) } } setFileData={setFileData} /> }
    </div>
  )
}

export function ActionsBar({selectActive, setSelectActive, requestDelete, requestShare }) {
  return (
    <div className="flex justify-between">
      <FileUploader />
      <div className="flex space-x-3">
        <div>
          { !selectActive && 
            <button onClick={ () => { setSelectActive(true); setSelectActive(true) }} className="rounded-lg text-white flex overflow-hidden bg-green-500 p-2">
              <Select className="w-6 h-6 fill-white" />
            </button>
          }
          { selectActive && 
            <div className="flex space-x-3">
              <button onClick={ () => { requestDelete() }} className="rounded-lg text-white flex overflow-hidden bg-green-500 p-2">
                <Delete className="w-6 h-6 fill-white" />
              </button>
              
              <Dropdown title="" img={Menu} style={{ outer: 'bg-green-500', inner:'', img: '' }}>
                <DropdownItem title='Share' onClick={ () => { requestShare()} } />
                <DropdownItem title='Cancel' onClick={ () => { setSelectActive(false)} } />
              </Dropdown>

            </div>
          }
        </div>
        <ViewSelector />
      </div>
    </div>
  )
}

export function TagActionsBar({selectActive, setSelectActive, requestDelete, requestShare, setFileData }) {
  return (
    <div className="flex justify-between">
      <TaggedFileUploader setFileData={setFileData} />
      <div className="flex space-x-3">
        <div>
          { !selectActive && 
            <button onClick={ () => { setSelectActive(true); setSelectActive(true) }} className="rounded-lg text-white flex overflow-hidden bg-green-500 p-2">
              <Select className="w-6 h-6 fill-white" />
            </button>
          }
          { selectActive && 
            <div className="flex space-x-3">
              <button onClick={ () => { requestDelete() }} className="rounded-lg text-white flex overflow-hidden bg-green-500 p-2">
                <Delete className="w-6 h-6 fill-white" />
              </button>
              
              <Dropdown title="" img={Menu} style={{ outer: 'bg-green-500', inner:'', img: '' }}>
                <DropdownItem title='Share' onClick={ () => { requestShare()} } />
                <DropdownItem title='Cancel' onClick={ () => { setSelectActive(false)} } />
              </Dropdown>

            </div>
          }
        </div>
        <ViewSelector />
      </div>
    </div>
  )
}
