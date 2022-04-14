const { Files } = require('../../models')
let files = require('../lib/file-system')

module.exports = async (req,res) => {
  let upload = req.body

  let fileId = await Files.create({
    user_id: 0,
    user_file_name: upload.fileName,
    user_file_path: upload.path,
    file_type: upload.fileType,
    file_ext: files.parseDir(upload.fileName).ext,
    file_size: upload.size,
    bytes_uploaded: 0,
    last_modified: new Date(),
    location_on_disk: await files.getNewFileLocation()
  })

  let file = await Files.findBy({ id: fileId })

  res.json(file)
}