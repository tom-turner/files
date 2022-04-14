const fs = require('fs')
const path = require('path');
const { Files } = require('../../models')
const directory = './file_storage'


let getNewFileLocation = async () => {
	let id = () => {
		return Math.random().toString(36).toUpperCase().substring(2, 36) + Math.random().toString(36).toUpperCase().substring(2, 36);
	}
	let exists = await Files.findBy({ location_on_disk : path.join(directory, id()) })

	if(exists){
		return this.generateId()
	} else {
		return path.join(directory, id())
	}
}

let parseDir = (data) => {
	return path.parse(data)
}

let joinPath = (dir, base) => {
	return path.join(dir, base)
}

module.exports.getNewFileLocation = getNewFileLocation
module.exports.parseDir = parseDir
module.exports.joinPath = joinPath