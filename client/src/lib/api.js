let UpChunk = require('@mux/upchunk')

const apiBase = "http://localhost:5001"

let serverCheck = async (callback) => {
  fetch(`${apiBase}/servercheck`, {
    credentials: "include"
  })
    .then((res) => res.json())
    .then((data) => { callback({ data: data }) })
    .catch((error) => { callback({ error: error }) })
  return
}

let uploadFileContent = async (file, serverData, callback) => {
  const upload = UpChunk.createUpload({
    endpoint:`${apiBase}/uploadFile/${serverData.id}/content`,
    file: file,
    chunkSize: 30720, // Uploads the file in ~30 MB chunks
    headers: {
      method:"PUT",
      credentials: "include"
    }
  });

  // subscribe to events
  upload.on('error', err => {
    callback({error: err})
    console.error(err.detail);
  });

  upload.on('progress', progress => {
    callback({progress: progress.detail})
    console.log(`So far we've uploaded ${progress.detail}% of this file.`);
  });

  upload.on('success', () => {
    callback({success: true})
    console.log("Wrap it up, we're done here. 👋");
  });
};

let uploadFile = async (file, callback) =>{
  let res = await fetch(`${apiBase}/uploadFile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify({
        fileName: file.name,
        path: window.location.pathname,
        fileType: file.type,
        size: file.size
      })
    })
    let data = await res.json()

    uploadFileContent(file, data, (e) => {
      callback(e)
    })
}

let uploadFiles = async (files, callback) => {
    Array.prototype.forEach.call(files, (file) => {
      uploadFile(file, (e) =>{
        callback(e)
      })
    })
}

let createDir = (fileName) => {
    fetch(`${apiBase}/createDir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        fileName: fileName,
        path: window.location.pathname,
      })
    })
    .then((res) => res.json())
    .then((data) => { return window.location.reload() })
    .catch((error) => { return alert(`error: ${error}`) })
}

let deleteFile = async (id) => {
  let result = await fetch(`${apiBase}/deleteFile/${id}`, {
    credentials: "include"
  })
  let body = await result.json()
  if(body)
    console.log(body)
    return window.location.reload()
}

let deleteDir = async (id) => {
  let result = await fetch(`${apiBase}/deleteDir/${id}`,{
    credentials: "include"
  })
  let body = await result.json()
  if(body)
    console.log(body)
    return window.location.reload()
}

let getFiles = async (path) => {
  const result = await fetch(`${apiBase}/getFiles/${path}`,{
    credentials: "include"
  });
  let body = await result.json()
  return body
}

let getFileData = async (fileId) => {
  const result = await fetch(`${apiBase}/getFile/${fileId}`,{
    credentials: "include"
  });
  let body = await result.json()
  return body.fileData
}

let getFileContent = async (fileId) => {
  const result = await fetch(`${apiBase}/getFile/${fileId}/content`,{
    credentials: "include"
  });
  const reader = result.body
  return reader
}

module.exports.apiBase = apiBase
module.exports.serverCheck = serverCheck
module.exports.uploadFile = uploadFile
module.exports.uploadFiles = uploadFiles
module.exports.createDir = createDir
module.exports.deleteFile = deleteFile
module.exports.deleteDir = deleteDir
module.exports.getFiles = getFiles
module.exports.getFileData = getFileData
module.exports.getFileContent = getFileContent
