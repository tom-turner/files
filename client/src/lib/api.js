let UpChunk = require('@mux/upchunk')

const apiBase = "http://localhost:5001"

let getAuthHeaders = () =>{
  let token = window.localStorage.getItem('token') // replace this with session cookies
  return {
      'Authorization': token
    }
}

let handleResponse = (body) => {
  console.log(body)
  return body
}

let serverCheck = async (callback) => {
  fetch(`${apiBase}/servercheck`)
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
    method:'PUT',
    headers: getAuthHeaders()
  });

  // subscribe to events
  upload.on('error', err => {
    let error = handleResponse(err)
    callback({error: error.detail})
    console.error(error.detail);
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
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        fileName: file.name,
        path: window.location.pathname,
        fileType: file.type,
        size: file.size,
        lastModified: file.lastModifiedDate,
      })
    })
    let body = await res.json()
    let data = handleResponse(body)

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

let createDir = async (fileName) => {
    let result = await fetch(`${apiBase}/createDir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        fileName: fileName,
        path: window.location.pathname,
      })
    })
    let body = await result.json()
    handleResponse(body)
    return window.location.reload()  
}

let deleteFiles = async (files) => {
   Array.prototype.forEach.call(files, async (file) => {
    let result = await fetch(`${apiBase}/deleteFile/${file.id}`, {
      headers: getAuthHeaders()
    })
    let body = await result.json()
    handleResponse(body)
    return window.location.reload()  
  });
}

let deleteDir = async (id) => {
  let result = await fetch(`${apiBase}/deleteDir/${id}`,{
    headers: getAuthHeaders()
  })
  let body = await result.json()
  handleResponse(body)
  return window.location.reload() 
}

let getFiles = async (path) => {
  const result = await fetch(`${apiBase}/getFiles/${path}`,{
    headers: getAuthHeaders()
  });
  let body = await result.json()
  return handleResponse(body)
}

let getFileData = async (fileId) => {
  const result = await fetch(`${apiBase}/getFile/${fileId}`, {
    headers: getAuthHeaders()
  });
  let body = await result.json()
  return handleResponse(body)
}

let getFileContent = async (fileId) => {
  const result = await fetch(`${apiBase}/getFile/${fileId}/content`,{
    headers: getAuthHeaders()
  });
  return handleResponse(result)
}

let register = async (input) => {
  const result = await fetch(`${apiBase}/register`,{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: input.username,
      password: input.password,
      token: input.token
    })
  });
  const body = await result.json()
  return handleResponse(body)
}

let session = async (input) => {
  const result = await fetch(`${apiBase}/session`,{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: input.username,
      password: input.password
    })
  });
  const body = await result.json()
  return handleResponse(body)
}

module.exports.apiBase = apiBase
module.exports.serverCheck = serverCheck
module.exports.uploadFile = uploadFile
module.exports.uploadFiles = uploadFiles
module.exports.createDir = createDir
module.exports.deleteFiles = deleteFiles
module.exports.deleteDir = deleteDir
module.exports.getFiles = getFiles
module.exports.getFileData = getFileData
module.exports.getFileContent = getFileContent
module.exports.register = register
module.exports.session = session


