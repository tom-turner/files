var CryptoJS = require("crypto-js");

class Checksum {
	constructor(){
		this.checksum = CryptoJS.algo.SHA256.create();
	}

	update(chunk){
		this.checksum.update(chunk)
	}

	finalize(){
		return this.checksum.finalize()
	}


} 

module.exports = Checksum