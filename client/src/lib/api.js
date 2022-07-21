let { getApiBase } = require('./apiBase')

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
    .then((data) => { callback(data) })
    .catch((error) => { callback({error: error}) })
}

class FileUploader {
  constructor({ url, chunkSize, callback, retryLimit, retryDelay }) {
    this.url = url
    this.progress = 0
    this.chunkSize = chunkSize || 1024
    this.chunkHistory = {}
    this.smallestPing = Infinity
    this.pid = {
      weights: {
        p: 1,
        i: 10 
      },
      i: 0,
      previousError: 0
    }
    this.callback = callback
    this.retryLimit = retryLimit
    this.retryDelay = retryDelay
    this.minChunkSize = 2.56e5
    this.maxChunkSize = 5e7
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

    this.chunkSize = Math.max(this.minChunkSize ,Math.min(Math.round(this.chunkSize * pUpdate) + this.pid.i, this.maxChunkSize))
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
      let lastProgressEventLoaded = 0
      let chunkLoaded = 0
      let requestStartTime = performance.now()

      let xhr = new XMLHttpRequest();

      xhr.onload = () => {
        if(xhr.status != 200){
          console.log('onload error')
          this.progress = this.progress - chunkLoaded
          return setTimeout(() => {
          if (retry >= this.retryLimit)
            return this.callback({
              error: `Uploading ${file.name} failed, server responded with error ${xhr.status}`,
              success: false,
              progress: (end / file.size) * 100
            })

          pump(file, chunkId, retry + 1)
          }, this.retryDelay)
        }
        //otherwise success
        let requestEndTime = performance.now()

        this.optimizeChunkSize(chunkId, {
          size: chunk.size,
          time: requestEndTime - requestStartTime
        })

        console.log(`Request of size ${chunk.size} took ${requestEndTime - requestStartTime} milliseconds`)

        if (end >= file.size - 1)
          return this.callback({
            error: null,
            success: true,
            progress: 100
          })

        pump(file, chunkId + 1, 0)
      }
      
      xhr.upload.onprogress = (event) => {
        this.progress = this.progress + ( event.loaded - lastProgressEventLoaded )
        lastProgressEventLoaded = event.loaded
        chunkLoaded = event.loaded

        this.callback({
          error: null,
          success: null,
          progress: this.progress / file.size * 100
        })
      }

      xhr.onerror = (event) => {
        console.log("onerror error",xhr.status)
        console.error(`Uploading ${file.name} failed, uploading chunk ${chunkId} failed with error responded with error ${event}. Retrying in ${this.retryDelay}`)
        this.progress = this.progress - chunkLoaded
        return setTimeout(() => {
          if (retry >= this.retryLimit)
            return this.callback({
              error: `Uploading ${file.name} failed, server responded with error ${event}`,
              success: false,
              progress: (end / file.size) * 100
            })

          pump(file, chunkId, retry + 1)
        }, this.retryDelay)
      }

      xhr.open('PUT', getApiBase() + this.url ) 
      xhr.withCredentials = true;
      xhr.setRequestHeader('Content-Type', chunk.type)
      xhr.setRequestHeader('Content-Range', `bytes ${start}-${end}/${file.size}`)
      xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))

      xhr.send(chunk)
    }

    pump(file, 0, 0)
  }
}

let uploadFileContent = async (file, serverData, callback) => {
  const uploader = new FileUploader({
    url: `/upload-file/${serverData.id}/content`,
    // chunkSize: 2.5e+6,
    callback,
    retryLimit: 5,
    retryDelay: 200
  })
  uploader.upload(file)
}

let uploadFile = async (file, callback) =>{
  let data = await http.post('/upload-file', null, JSON.stringify({
    fileName: file.name,
    path: window.location.pathname,
    fileType: file.type,
    size: file.size,
    lastModified: file.lastModifiedDate,
  })).then(res => res.json())

  if(data)
    callback({ data: data })

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


let deleteFile = async (id) => {
  const response = http.delete(`/delete-file/${id}`)
    .then(res => res.json())

  if (response)
    console.log(response)
    return window.location.reload()
}

let deleteFiles = async (files, callback) => {
  console.log(files)
   Array.prototype.forEach.call(files, async (file) => {
     http.delete(`/delete-file/${file.id}`)
       .then(res => callback(res.json()) )
  });
}

let deleteTag = async (tag, callback) => {
  console.log(tag.id)
  http.delete(`/delete-tag/${tag.id}`)
    .then(res => callback(res.json()) )
}

let removeTag = async (fileId, tagId) => {
  http.post(`/remove-tag`, null, JSON.stringify({
      fileId: fileId,
      tagId: tagId,
    }))
    .then(res => res.json() )
}


let getFiles = async (query) => {
  return http.get(`/search-files/?search=${query}`)
    .then(res => res.json())
}

let getFileData = async (fileId) => {
  return http.get(`/get-file/${fileId}`)
    .then(res => res.json())
}

let getFileContent = async (fileId) => {
  return http.get(`/get-file/${fileId}/content`)
    .then(res => res.body)
}

let getSharedFiles = async (slug) => {
  return http.get(`/get-share/${slug}`)
    .then(res => res.json())
}

let getSharedFileData = async (slug, id) => {
  return http.get(`/get-share/${slug}/${id}`)
    .then(res => res.json())
}

let getSharedFileContent = async (slug, id) => {
  return http.get(`/get-share/${slug}/${id}/content`)
    .then(res => res.body)
}

let getSharedTagsByUser = async (query) => {
  return http.get(`/get-shared-tags-by-user`)
    .then(res => res.json())
}

let getUsersBySharedTag = async (shareId) => {
  return http.get(`/get-users-by-shared-tag/${shareId}`)
    .then(res => res.json())
}

let getFilesBySharedTag = async (shareId) => {
  return http.get(`/get-files-by-shared-tag/${shareId}`)
    .then(res => res.json())
}

let getFilesByTag = async (tagId) => {
  return http.get(`/get-files-by-tag/${tagId}`)
    .then(res => res.json())
}

let getSharedTagById = async (shareId) => {
  return http.get(`/get-tag-by-sharing-id/${shareId}`)
    .then(res => res.json())
}

let getTagById = async (id) => {
  return http.get(`/get-tag-by-id/${id}`)
    .then(res => res.json())
}

let createTagFileJoin = async (files, tagName, tagColour, callback) => {
  Array.prototype.forEach.call(files, async (file) => {
    return http.post(`/create-tag-file-join`, null, JSON.stringify({
      fileId: file.id,
      tagName: tagName,
      tagColour: tagColour 
    })).then( async res => callback({ fileId: file.id, tag: await res.json() }) )
  })
}

let createTagFileJoinByTagId = async (files, tagId, callback) => {
  Array.prototype.forEach.call(files, async (file) => {
    return http.post(`/create-tag-file-join`, null, JSON.stringify({
      fileId: file.id,
      tagId: tagId
    })).then( async res => callback({ fileId: file.id, tag: await res.json() }) )
  })
}

let createSharedTag = async (tagName, tagColour) => {
  return http.post(`/create-shared-tag/`, null, JSON.stringify({
      tagName: tagName,
      tagColour: tagColour 
  })).then( res =>  res.json() ) 
}

let renameFile = async (fileId, fileName) => {
  return http.post(`/rename-file`, null, JSON.stringify({
    fileId: fileId,
    fileName: fileName
  })).then(res => res.json())
}

let renameTag = async (tagId, tagName, tagColour ) => {
  return http.post(`/rename-tag`, null, JSON.stringify({
    tagId: tagId,
    tagName: tagName,
    tagColour: tagColour
  })).then(res => res.json())
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
module.exports.deleteFiles = deleteFiles
module.exports.deleteTag = deleteTag
module.exports.removeTag = removeTag
module.exports.getFiles = getFiles
module.exports.getFileData = getFileData
module.exports.getFileContent = getFileContent
module.exports.getSharedFiles = getSharedFiles
module.exports.getSharedFileData = getSharedFileData
module.exports.getSharedFileContent = getSharedFileContent
module.exports.createTagFileJoin = createTagFileJoin
module.exports.createTagFileJoinByTagId = createTagFileJoinByTagId
module.exports.createSharedTag = createSharedTag
module.exports.renameFile = renameFile
module.exports.renameTag = renameTag
module.exports.register = register
module.exports.session = session
module.exports.getSharedTagsByUser = getSharedTagsByUser
module.exports.getUsersBySharedTag = getUsersBySharedTag
module.exports.getFilesBySharedTag = getFilesBySharedTag
module.exports.getFilesByTag = getFilesByTag
module.exports.getSharedTagById = getSharedTagById
module.exports.getTagById = getTagById


