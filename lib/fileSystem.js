const fs = require('fs')
const directory = './file_storage'

class Files {
	constructor(dir){
		console.log(dir)
	}

	uploadFile(){
		return ''
	}
}

module.exports = (dir) => {
	return new Files(dir);
}