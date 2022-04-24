const { Files } = require('../../models')
const fs = require('fs')

let chunks = {}

module.exports = async (req, res) => {
  let file = await Files.findBy({ id: req.params.id })

  if(!file)
    return res.status(400).send()

  file.bytes_uploaded = file.bytes_uploaded === 0 ? -1 : file.bytes_uploaded


  let [_, start, end, length] = /bytes ([0-9]+)-([0-9]+)\/([0-9]+)/.exec(req.header('content-range'))

  let fileChunks = chunks[file.id] || {}
  fileChunks[start] = {
    start,
    end,
    data: req.body
  }
  chunks[file.id] = fileChunks

  console.log(file.bytes_uploaded, fileChunks)

  let writeStream = fs.createWriteStream(
    __dirname + `/../../file_storage/${file.checksum}`,
    { flags: 'a' }
  ).on('error', () => {
    console.log('error')
    res.status(500).send()
  })

  while (fileChunks[file.bytes_uploaded + 1]) {
    let chunk = fileChunks[file.bytes_uploaded + 1]

    await writeStream.write(chunk.data)
    await Files.update(file.id, {
      bytes_uploaded: chunk.end
    })
    delete fileChunks[file.bytes_uploaded + 1]
    file.bytes_uploaded = end
  }

  await writeStream.close()

  res.status(200).send()
}
