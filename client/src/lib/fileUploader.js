function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

let streamBinary = async (file, serverData, callback) => {
	window.localStorage.setItem( 'fileUpload', JSON.stringify({ inProgress: true, data: serverData }) )
	
	// then stream file to server somehow ¯\_(ツ)_/¯

  const stream = new ReadableStream({file})

  fetch('/streamBinary', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: stream,
  });

  let progress = 0
  let count = setInterval( () => {
    callback(progress)
    progress ++
    if(progress > 100) {
      clearInterval(count)

    }
  }, 10)

}

let uploadFile = async (file, callback) =>{
  console.log(file)
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

let uploadFiles = async (files, callback) => {
    Array.prototype.forEach.call(files, (file) => {
      uploadFile(file, (progress) =>{
        callback(progress)
      })
    })
}


module.exports.uploadFile = uploadFile
module.exports.uploadFiles = uploadFiles