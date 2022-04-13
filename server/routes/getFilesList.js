const { Files, Directories } = require('../../models')

module.exports = async (req,res) => {
  let path = req.body.path || ''

  let fileList = await Files.findAllBy({ user_file_path : path, user_id: 0})
  let dirList = await Directories.findAllBy({ user_file_path : path, user_id: 0})

  return res.json({ files: fileList, dirs: dirList })
}
