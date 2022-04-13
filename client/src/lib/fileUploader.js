let streamBinary = (file, serverData, callback) => {
	window.localStorage.setItem( 'fileUpload', JSON.stringify({ inProgress: true, data: serverData }) )
	
	// then stream file to server somehow ¯\_(ツ)_/¯

  let progress = 0
  let count = setInterval( () => {
    callback(progress)
    progress ++
    if(progress > 100) {
      clearInterval(count)
      window.location.reload()
    }
  }, 500)
  

}

let uploadFile = async (file, callback) => {
    let res = await fetch("/uploadFile", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      	fileName: file.name,
      	path: window.location.pathname,
      	fileType: file.type,
      	size: file.size
      })
    })
    let data = await res.json()

    streamBinary(file, data, (progress) => {
      callback(progress)
    })
}

module.exports.uploadFile = uploadFile