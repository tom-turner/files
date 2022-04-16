import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { deleteFile, deleteDir, getFiles } from '../../lib/api'
import CreateDirectory from "./CreateDirectory"
import FileUpload from "./FileUpload"
import Header from "./Header"
import ServerCheck from "../ServerCheck"

const FileLink = ({ to, name, className }) => (
  <Link className={"my-auto p-2 text-left " + className} to={to}>{name}</Link>
)

const DirectoryLink = ({ to, name, className }) => (
  <Link className={"my-auto p-2 text-left " + className} to={to}>{name}</Link>
)

const DeleteButton = ({onClick, className}) => {
  return <button onClick={onClick} className={"border border-black rounded px-2 text-sm" + className}> Delete </button>
}

let FileExplorer = ({ path }) => {
  const [ files, setFiles ]= useState([])
  const [ dirs, setDirs ]= useState([])

  useEffect( () => {
    ;(async () => {
      let result = await getFiles(path)
      setFiles(result.files)
      setDirs(result.dirs)
      return
    })()
  }, [path]);

  const listFiles = files.map((file) =>
    <div className="w-full bg-gray-100 rounded flex flex-col p-4 justify-between max-w-sm mx-auto">
      <FileLink to={'/file:/'+file.id } name={file.user_file_name} />
      <DeleteButton onClick={ () => { deleteFile(file.id) } } />
    </div>
  );

  const listDirs = dirs.map((file) =>
    <div className="w-full bg-gray-200 rounded flex flex-col p-4 justify-between max-w-sm mx-auto">
      <DirectoryLink to={ file.user_file_path + file.user_file_name } name={file.user_file_name}/>
      <DeleteButton onClick={ () => { deleteDir(file.id) } } />
    </div>
  );

  return (
    <div className="w-full mx-auto flex flex-col">
      <ServerCheck />
      <Header />
      <FileUpload />
      <div className="w-full grid grid-cols-3 gap-2">
        <CreateDirectory />
        {listDirs}
      </div>
      <div className="w-full grid grid-cols-3 gap-2">
        {listFiles}
      </div>
    </div>
  )
}

export default FileExplorer;
