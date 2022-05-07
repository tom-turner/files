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

let IconByBroadType = ({className, filetype}) => {
	let broadType = filetype.split('/')[0]

	switch (broadType){
		case 'text':
			return <Text className={className} />

		case 'audio':
			return <Audio className={className} />

		case 'image':
			return <Image className={className} />

		case 'video':
			return <Video className={className} />

		case 'directory':
			return <Dir className={className} />

		default: 
			return <DefaultFileIcon className={className} filetype={filetype} />
	}
}

let IconByType = ({className, filetype}) => {
	switch (filetype){
		case 'text/csv':
			return <Csv className={className} />

		case 'application/zip':
			return <Zip className={className} />

		case 'application/pdf':
			return <Pdf className={className} />

		default: 
			return <IconByBroadType className={className} filetype={filetype} />
	}	
}

export default IconByType
