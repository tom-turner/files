
let FileUploadButton = (props) => {
	
	return (
		<div className="">
			<lable> Upload: </lable>
			<input type="file" className="" onChange={props.onChange} />
		</div>

	)
}


export default FileUploadButton;


