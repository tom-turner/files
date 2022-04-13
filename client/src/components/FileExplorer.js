import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import CreateDirectory from "./CreateDirectory"
import ServerCheck from "./ServerCheck"
import FileUpload from "./FileUpload"

let fileDelete = (url, id) => {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id })
  })
  window.location.reload()
}

const FileLink = ({ to, name, className }) => (
  <Link className={"my-auto p-2 text-left " + className} to={to}>{name}</Link>
)

const DirectoryLink = ({ to, name, className }) => (
  <Link className={"my-auto p-2 text-left " + className} to={to}>{name}</Link>
)

let FileExplorer = ({ path }) => {
  const [ files, setFiles ]= useState([])
  const [ dirs, setDirs ]= useState([])

  useEffect( () => {
    ;(async () => {
      const result = await fetch("/explorer", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });
      let body = await result.json()
      setFiles(body.files)
      setDirs(body.dirs)
      return
    })()
  }, [path]);

  const listFiles = files.map((file) =>
    <div className="w-full bg-gray-100 rounded flex flex-col p-4 justify-between max-w-sm mx-auto">
      <FileLink to={'/file:/'+file.id } name={file.user_file_name} />
      <button onClick={ () => { fileDelete('/deleteFile', file.id) } } className="border border-black rounded px-2 text-sm"> Delete </button>
    </div>
  );

  const listDirs = dirs.map((file) =>
    <div className="w-full bg-gray-200 rounded flex flex-col p-4 justify-between max-w-sm mx-auto">
      <DirectoryLink to={ file.user_file_path + file.user_file_name } name={file.user_file_name}/>
      <button onClick={ () => { fileDelete('/deleteDir', file.id) } } className="border border-black rounded px-2 text-sm"> Delete </button>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col space-y-2">
      <FileUpload />

      <div className="w-full grid grid-cols-3 gap-2">
        <CreateDirectory />
        {listDirs}
      </div>

      <div className="w-full grid grid-cols-3 gap-2">{listFiles}</div>

    </div>
  )

}


export default FileExplorer;
