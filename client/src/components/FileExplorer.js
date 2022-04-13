import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreateDirectory from "./CreateDirectory"

let view = "grid"


let GenerateDeleteButton = (props) => {
	return <button onClick={props.onClick} id={props.id} className="border border-black rounded px-2 text-sm"> Delete</button>
}

let GenerateLink = (props) => {
	return <a className="my-auto p-2 text-left" href={props.link}>{props.name}</a>
}

let FileExplorer = () => {
	const [ files, setFiles ]= useState([])
	const [ dirs, setDirs ]= useState([])
	
	useEffect( () => {
		;(async () => {
			const result = await fetch("/explorer", {
      			method: 'POST',
      			headers: { 'Content-Type': 'application/json' },
      			body: JSON.stringify({ path: window.location.pathname })
			});
			let body = await result.json()
			setFiles(body.files)
			setDirs(body.dirs)
			return
		})()
	},[]);

	const listFiles = files.map((file) =>
  		<div className="w-full bg-gray-100 rounded flex flex-col p-4 justify-between max-w-sm mx-auto">
  			<GenerateLink link={'/file:/'+file.id } name={file.user_file_name}/>
  			<GenerateDeleteButton id={file.id} />
  		</div>
	);
	const listDirs = dirs.map((file) =>
  		<div className="w-full bg-gray-200 rounded flex flex-col p-4 justify-between max-w-sm mx-auto">
  			<GenerateLink link={ file.user_file_path + file.user_file_name } name={file.user_file_name}/>
  			<GenerateDeleteButton />
  		</div>
	);

	switch(view){
		case 'grid':
			return (
				<div className="w-full flex flex-col space-y-2">
					<div className="w-full grid grid-cols-3 gap-2">
						<CreateDirectory />
						{listDirs}
					</div>
					<div className="w-full grid grid-cols-3 gap-2">{listFiles}</div>
				</div>
			)
			break;
		case 'list':
			return (
				<div className="w-full flex flex-col">
					<div className="w-full flex flex-col">{listDirs}</div>
					<div className="w-full flex flex-col">{listFiles}</div>
				</div>
			)
			break;
		default:
	}
	

}


export default FileExplorer;