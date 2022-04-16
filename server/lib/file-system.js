const fs = require('fs')
const path = require('path');
const { Files } = require('../../models')
const directory = './file_storage'


let getChecksum = async () => {
	let checksum = () => {
		return Math.random().toString(36).toUpperCase().substring(2, 36) + Math.random().toString(36).toUpperCase().substring(2, 36);
	}
	let exists = await Files.findBy({ checksum : checksum() })

	if(exists){
		return this.getChecksum()
	} else {
		return checksum()
	}
}

let parseDir = (data) => {
	return path.parse(data)
}

let joinPath = (dir, base) => {
	return path.join(dir, base)
}

module.exports.getChecksum = getChecksum
module.exports.parseDir = parseDir
module.exports.joinPath = joinPath