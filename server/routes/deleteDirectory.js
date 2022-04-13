const { Directories } = require('../../models')

module.exports = async (req,res) => {
  let dir = await Directories.delete({id: req.body.id , user_id: 0 })
  let dirPath = dir.user_file_path + "/" + dir.user_file_name
  Files.delete(({user_file_path: dirPath, user_id: 0 }))
  res.json({ message: "dir deleted"})
}
