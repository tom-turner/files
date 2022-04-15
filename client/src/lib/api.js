let UpChunk = require('@mux/upchunk')

const apiBase = "http://localhost:5001"

let uploadFileContent = async (file, serverData, callback) => {
  const upload = UpChunk.createUpload({
    endpoint:`${apiBase}/uploadFile/${serverData.id}/content`,
    file: file,
    chunkSize: 30720, // Uploads the file in ~30 MB chunks
  });

  // subscribe to events
  upload.on('error', err => {
    console.error('💥 🙀', err.detail);
  });

  upload.on('progress', progress => {
    console.log(`So far we've uploaded ${progress.detail}% of this file.`);
  });

  upload.on('success', () => {
    console.log("Wrap it up, we're done here. 👋");
  });
};

let uploadFile = async (file, callback) =>{
  let res = await fetch(`${apiBase}/uploadFile`, {
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
    fetch(`${apiBase}/createDir`, {
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
  fetch(`${apiBase}/deleteFile/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  window.location.reload()
}

let deleteDir = (id) => {
  fetch(`${apiBase}/deleteDir/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  window.location.reload()
}

let getFiles = async (path) => {
  const result = await fetch(`${apiBase}/getFiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  });
  let body = await result.json()
  return body
}

let getFileData = async (fileId) => {
  const result = await fetch(`${apiBase}/getFile/${fileId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
  });
  let body = await result.json()
  return body.fileData
}

let getFileContent = async (fileId) => {
  const result = await fetch(`${apiBase}/getFile/${fileId}/content`);
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
