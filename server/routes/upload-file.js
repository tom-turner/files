const { Files } = require('../../models')
let files = require('../lib/file-system')

module.exports = async (req, res) => {
  let upload = req.body

  let fileId = await Files.create({
    user_id: res.locals.user.id,
    user_file_name: upload.fileName,
    user_file_path: upload.path,
    file_type: upload.fileType,
    file_ext: files.parseDir(upload.fileName).ext,
    file_size: upload.size,
    bytes_uploaded: 0,
    last_modified: upload.lastModified,
    checksum: await files.getChecksum()
  })

  let file = await Files.findBy({ id: fileId })

  res.json(file)
}
