let { getApiBase } = require('./apiBase')
let UpChunk = require('@mux/upchunk')

class Http {
  constructor(base, headers) {
    this.base = base
    this.headers = headers
  }

  async request(method, url, params, body, headers) {
    if (params)
      url = url + '?' + new URLSearchParams(params).toString()

    headers = headers || {}

    return fetch(`${this.base}${url}`, {
      method,
      body,
      credentials: 'include',
      headers: Object.fromEntries(Object.entries({ ...this.headers, ...headers }).map(([name, value]) => {
        return [name, typeof value === 'function' ? value() : value]
      }))
    })
  }

  async get(url, params) { return this.request('GET', url, params) }
  async post(url, params, body) { return this.request('POST', url, params, body) }
  async delete(url, params) { return this.request('DELETE', url, params) }
  async put(url, params, body, headers) { return this.request('PUT', url, params, body, headers) }
}

const http = new Http( getApiBase(), {
  'Content-Type': 'application/json',
  'Authorization': () => window.localStorage.getItem('token')
})

let serverCheck = async (callback) => {
  http.get('/servercheck')
    .then((res) => res.json())
    .then((data) => { callback({ data: data }) })
    .catch((error) => { callback({ error: error }) })
}

class FileUploader {
  constructor({ url, chunkSize, callback, retryLimit, retryDelay }) {
    this.url = url
    this.chunkSize = chunkSize || 1024
    this.chunkHistory = {}
    this.smallestPing = Infinity
    this.pid = {
      weights: {
        p: 1.5,
        i: 0.5
      },
      i: 0,
      previousError: 0
    }
    this.callback = callback
    this.retryLimit = retryLimit
    this.retryDelay = retryDelay
  }

  optimizeChunkSize(id, { size, time }) {
    this.chunkHistory[id] = { size, time }
    const uxResponseTarget = 500

    if (time < this.smallestPing)
      this.smallestPing = time

    const target = this.smallestPing + uxResponseTarget
    const error = target - time
    const pUpdate = (this.pid.weights.p * error) / time

    this.pid.i += Math.max(10, Math.min(1000, error * this.pid.weights.i))

    this.chunkSize =  Math.min(Math.round(this.chunkSize * pUpdate) + this.pid.i, 1e8)
    console.log(target, error, pUpdate, this.pid, this.chunkSize)
  }

  chunkStart(id) {
    let start = 0
    for (let [id, chunk] of Object.entries(this.chunkHistory)) {
      start = start + chunk.size
    }
    return start
  }

  chunkEnd(id) {
    return this.chunkStart(id) + this.chunkSize
  }

  upload(file) {
    const pump = async (file, chunkId, retry) => {
      const start = this.chunkStart(chunkId)
      const chunk = file.slice(start, this.chunkEnd(chunkId), file.type === '' ? 'application/octet-stream' : file.type)
      const end = start + chunk.size - 1

      let requestStartTime = performance.now()
      let response 
      try {
        response = await http.put(this.url, null, chunk, {
          'Content-Type': chunk.type,
          'Content-Range': `bytes ${start}-${end}/${file.size}`
        })
      } catch (e) {
        return console.error(`Uploading ${file.name} failed, uploading chunk ${chunkId} failed with error responded with error ${e}. Retrying in ${this.retryDelay}`)
      }
      let requestEndTime = performance.now()

      this.optimizeChunkSize(chunkId, {
        size: chunk.size,
        time: requestEndTime - requestStartTime
      })

      console.log(`Request of size ${chunk.size} took ${requestEndTime - requestStartTime} milliseconds`)

      if (!response.ok) {
        console.error(`Uploading ${file.name} failed, uploading chunk ${chunkId} failed with error. Server responded with status ${response.status}. Retrying in ${this.retryDelay}.`)

        return setTimeout(() => {
          if (retry >= this.retryLimit)
            return this.callback({
              error: `Uploading ${file.name} failed, server responded with error ${response}`,
              success: false,
              progress: (end / file.size) * 100
            })

          pump(file, chunkId, retry + 1)
        }, this.retryDelay)
      }

      this.callback({
        error: null,
        success: null,
        progress: (end / file.size) * 100
      })

      if (end >= file.size - 1)
        return this.callback({
          error: null,
          success: true,
          progress: (end / file.size) * 100
        })

      pump(file, chunkId + 1, 0)
    }

    pump(file, 0, 0)
  }
}

let uploadFileContent = async (file, serverData, callback) => {
  const uploader = new FileUploader({
    url: `/uploadFile/${serverData.id}/content`,
    // chunkSize: 2.5e+6,
    callback,
    retryLimit: 5,
    retryDelay: 200
  })
  uploader.upload(file)
}

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

let deleteFiles = async (files) => {
   Array.prototype.forEach.call(files, async (file) => {
     http.delete(`/deleteFile/${file.id}`)
       .then(res => res.json())
       .then(() => window.location.reload())
  });
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


