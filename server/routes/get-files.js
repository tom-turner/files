const { Files, Directories } = require('../../models')

module.exports = async (req,res) => {
  let path = '/' + req.params[0]

  let fileList = await Files.findAllBy({ user_file_path : path })
  let dirList = await Directories.findAllBy({ user_file_path : path })

  return res.json({ files: fileList, dirs: dirList })
}
