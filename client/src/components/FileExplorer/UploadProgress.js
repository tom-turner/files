import {ReactComponent as DefaultFileIcon}  from '../../assets/fileicon.svg';

let ProgressBar = ({progress, className }) => {
	return (
		<div className={className} >
			<div className={"w-full bg-gray-200 m-2 mx-auto rounded-full overflow-hidden "}> 
				<div className="w-0 h-2 bg-green-600" style={{width: progress+"%"}}>  </div>
			</div>
		<p > {progress}% done </p>
		</div>
	)
}

let UploadProgress = ({ progress, viewMode }) => {
	if (progress > 100 || progress === 0)
		return

	return(
			<div className={"relative flex overflow-hidden break-words cursor-pointer " + (viewMode === 'grid' ? 'flex-col ' : 'flex-row ') } >
				<DefaultFileIcon className={"z-50 p-2 mx-auto w-12 md:w-24 rounded-lg bg-gray-100 " + (viewMode === 'grid' ? 'w-16 md:w-24 m-2' : 'w-20' )} />
				<ProgressBar progress={progress} className={'w-full my-auto'} />
			</div>
	)	
}

export default UploadProgress;
