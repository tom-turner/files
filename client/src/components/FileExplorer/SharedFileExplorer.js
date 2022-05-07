import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { getSharedFiles } from "../../lib/api"
import useStickyState from "../../lib/useStickyState"
import { useParams } from "react-router-dom";
import IconByType from '../IconByType'
import { Error } from "../Alerts"


export function SharedFileExplorer() {
  const params = useParams()
  const navigate = useNavigate();
  const slug = params['slug']
  const [ error, setError ] = useState(null)
  const [ files, setFiles ] = useState([])
  const [ viewMode, setViewMode]= useStickyState('list', 'viewMode')
  const updateFileList = async () => {
    let result = await getSharedFiles(slug)

    if(result.error)
      setError(result.error)

    if(result.files)
      setFiles(result.files)
  }

  useEffect(() => { updateFileList() } ,[slug])

  if(error)
    return (
      <Error error={error} />
    )

  const listFiles = files.map((file) => {
    console.log(file)
    return (
    <div className={"relative flex overflow-hidden break-words cursor-pointer " + ( viewMode === 'grid' ? 'flex-col' : 'flex-row' ) } onClick={ () => { navigate(`/share/${slug}/${file.id}`) } }>
      <IconByType filetype={file.file_type} className={"z-50 p-2 mx-auto w-12 md:w-24 rounded-lg " + (viewMode === 'grid' ? 'w-16 md:w-24 m-2' : 'w-20 md:w-36' )} />
      
      <p className={"my-auto z-50 w-full underline px-4 " + (viewMode === 'grid' ? 'text-center' : 'text-left' )}>{file.user_file_name }</p>
      
      <p className={"text-right my-auto mx-auto z-50 w-full p-4 hidden md:block" + (viewMode === 'grid' ? 'hidden' : '' ) }>{'Last Modified: ' +  new Date(file.last_modified).toLocaleDateString() }</p>
    </div>
  )
  });

  return (
    <div className="w-full relative min-h-screen overflow-scroll mx-auto flex flex-col">
      <div className="flex-grow px-6 py-3 flex flex-col space-y-6">
        <p className="font-bold text-2xl text-center"> Shared Files </p>
        <div className={"w-full grid " + ( viewMode === "list" ? "gap-1 grid-cols-1" : "gap-6 grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7")}>
          {listFiles}
        </div>
      </div>
    </div>
  )
}