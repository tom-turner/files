// https://www.svgrepo.com/collection/file-type-doctype-vectors/
import {ReactComponent as DefaultFileIcon}  from '../assets/fileicon.svg';
import {ReactComponent as Audio}  from '../assets/audio.svg';
import {ReactComponent as Csv}  from '../assets/csv.svg';
import {ReactComponent as Text}  from '../assets/text.svg';
import {ReactComponent as Zip}  from '../assets/zip.svg';
import {ReactComponent as Image}  from '../assets/image.svg';
import {ReactComponent as Pdf}  from '../assets/pdf.svg';
import {ReactComponent as Video}  from '../assets/video.svg';
import {ReactComponent as Dir}  from '../assets/directory.svg';

let IconByBroadType = ({className, fileType}) => {
	let broadType = fileType.split('/')[0]

	switch (broadType){
		case 'text':
			return <Text className={className} />
			break;
		case 'audio':
			return <Audio className={className} />
			break;
		case 'image':
			return <Image className={className} />
			break;
		case 'video':
			return <Video className={className} />
			break;
		case 'directory':
			return <Dir className={className} />
			break;
		default: 
			return <DefaultFileIcon className={className} fileType={fileType} />
	}
}

let IconByType = ({className, fileType}) => {
	switch (fileType){
		case 'text/csv':
			return <Csv className={className} />
			break;
		case 'application/zip':
			return <Zip className={className} />
			break;
		case 'application/pdf':
			return <Pdf className={className} />
			break;
		default: 
			return <IconByBroadType className={className} fileType={fileType} />
	}	
}

export default IconByType
