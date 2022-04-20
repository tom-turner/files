let UpChunk = require('@mux/upchunk')

const apiBase = "http://localhost:5001"

class Http {
  constructor(base, headers) {
    this.base = base
    this.headers = headers
  }

  async request(method, url, params, body) {
    if (params)
      url = url + '?' + new URLSearchParams(params).toString()

    return fetch(`${this.base}${url}`, {
      method,
      body,
      headers: Object.fromEntries(Object.entries(this.headers).map(([name, value]) => {
        return [name, typeof value === 'function' ? value() : value]
      }))
    })
  }

  async get(url, params) { return this.request('GET', url, params) }
  async post(url, params, body) { return this.request('POST', url, params, body) }
  async delete(url, params) { return this.request('DELETE', url, params) }
  async put(url, params, body) { return this.request('PUT', url, params, body) }
}

const http = new Http('http://localhost:5001', {
  'Content-Type': 'application/json',
  'Authorization': () => window.localStorage.getItem('token')
})

let serverCheck = async (callback) => {
  http.get('/servercheck')
    .then((res) => res.json())
    .then((data) => { callback({ data: data }) })
    .catch((error) => { callback({ error: error }) })
}

let uploadFileContent = async (file, serverData, callback) => {
  const upload = UpChunk.createUpload({
    endpoint:`${apiBase}/uploadFile/${serverData.id}/content`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': window.localStorage.getItem('token')
    },
    file: file,
    chunkSize: 30720, // Uploads the file in ~30 MB chunks
    method:'PUT'
  });

  // subscribe to events
  upload.on('error', error => {
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
  let data = await http.post('/uploadFile', null, JSON.stringify({
    fileName: file.name,
    path: window.location.pathname,
    fileType: file.type,
    size: file.size,
    lastModified: file.lastModifiedDate,
  })).then(res => res.json())

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
  http.post('/createDir', null, JSON.stringify({
    fileName: fileName,
    path: window.location.pathname,
  }))
    .then((res) => res.json())
    .then((data) => { return window.location.reload() })
    .catch((error) => { return alert(`error: ${error}`) })
}

let deleteFile = async (id) => {
  const response = http.delete(`/deleteFile/${id}`)
    .then(res => res.json())

  if (response)
    console.log(response)
    return window.location.reload()
}

let deleteDir = async (id) => {
  const response = http.delete(`/deletedir/${id}`)
    .then(res => res.json())

  if (response)
    console.log(response)
    return window.location.reload()
}

let getFiles = async (path) => {
  return http.get(`/getFiles/${path}`)
    .then(res => res.json())
}

let getFileData = async (fileId) => {
  return http.get(`/getFile/${fileId}`)
    .then(res => res.json())
}

let getFileContent = async (fileId) => {
  return http.get(`/getFile/${fileId}/content`)
    .then(res => res.body)
}

let deleteFiles = async (files) => {
   Array.prototype.forEach.call(files, async (file) => {
     http.post(`${apiBase}/deleteFile/${file.id}`)
       .then(res => res.json())
       .then(() => window.location.reload())
  });
}

let register = async (input) => {
  return http.post('/register', null, JSON.stringify({
    username: input.username,
    password: input.password,
    token: input.token
  })).then(res => res.json())
}

let session = async (input) => {
  return http.post('/session', null, JSON.stringify({
    username: input.username,
    password: input.password
  })).then(res => res.json())
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


