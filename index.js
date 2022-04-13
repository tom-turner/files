const express = require('express')
const fs = require('fs')
const crypto = require('crypto')

let app = express()

app.use(express.json())

let files = []

function fileWithIdExists(req, res, next) {
  if (!files[req.params.id])
    return res
      .status('404')
      .end(JSON.stringify({ error: `No file exists for id ${req.params.id}` }))

  next()
}

function createFile({ name }) {
  files.push({ name })
  return files.length - 1
}

function getFileMetadata(id) {
  return files[id]
}

// Upload large files
// first we create a file reference
app.post('/files', (req, res) => {
  const fileId = createFile(req.body)
  res.end(JSON.stringify({ fileId }))
})

// then we upload the binary data to the file reference
app.post('/files/:id/content', fileWithIdExists, (req, res) => {
  const file = getFileMetadata(req.params.id)
  const stream = fs.createWriteStream(file.name, { flags: 'w' })
  stream
    .on('finish', () => res.end())
    .on('error', (e) => res.status('400').end(JSON.stringify({ error: e.stack })))
  req.pipe(stream) // Whole file isn't stored in memory
})

// Serve large files
// Route for accessing file meta data
app.get('/files/:id', fileWithIdExists, (req, res) => {
  res.end(JSON.stringify(files[req.params.id]))
})

// Route for accessing file contents
app.get('/files/:id/content', fileWithIdExists, (req, res) => {
  const file = files[req.params.id]
  const stream = fs.createReadStream(file.name)
  stream.pipe(res) // Not the whole file stored in memory
})

app.listen(4000, () => console.log('Listening on port 4000'))
