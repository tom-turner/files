import { useRef } from 'react'
import {ReactComponent as UploadIcon}  from './assets/upload.svg';



let FileUploadButton = (props) => {
	let fileUpload = useRef()
	return (
		<div onClick={() => { fileUpload.current.click() }} className="flex space-x-3 bg-green-500 hover:bg-indigo-500 px-4 py-2 rounded-lg cursor-pointer">
			<UploadIcon className={'w-6 h-6 my-auto fill-white'} />
			<p className="my-auto text-white"> Upload Files </p>
			<input type="file" ref={fileUpload} className={'hidden ' + props.className} onChange={props.onChange} />
		</div>

	)
}


export default FileUploadButton;


