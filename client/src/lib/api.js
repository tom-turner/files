let uploadFileContent = async (file, serverData, callback) => {
	window.localStorage.setItem( 'fileUpload', JSON.stringify({ inProgress: true, data: serverData }) )
	
	// then stream file to server somehow ¯\_(ツ)_/¯

  const stream = new ReadableStream({file})

  fetch(`/uploadFile/${serverData.id}/content`, {
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

    uploadFileContent(file, data, (progress) => {
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

let createDir = (fileName) => {
    fetch("/createDir", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: fileName,
        path: window.location.pathname,
      })
    })
    .then((res) => res.json())
    .then((data) => { return window.location.reload() })
    .catch((error) => { return alert(`error: ${error}`) })
}

let deleteFile = (id) => {
  fetch(`/deleteFile/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  window.location.reload()
}

let deleteDir = (id) => {
  fetch(`/deleteDir/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  window.location.reload()
}

let getFiles = async (path) => {
  const result = await fetch("/getFiles", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  });
  let body = await result.json()
  return body
}

let getFileData = async (fileId) => {
  const result = await fetch(`/getFile/${fileId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
  });
  let body = await result.json()
  return body.fileData
}

let getFileContent = async (fileId) => {
  const result = await fetch(`/getFile/${fileId}/content`);
  const reader = result.body
  return reader
}

module.exports.uploadFile = uploadFile
module.exports.uploadFiles = uploadFiles
module.exports.createDir = createDir
module.exports.deleteFile = deleteFile
module.exports.deleteDir = deleteDir
module.exports.getFiles = getFiles
module.exports.getFileData = getFileData
module.exports.getFileContent = getFileContent
