const { Directories, Files } = require('../../models')

module.exports = async (req,res) => {
  let dir = await Directories.delete({id: req.params.id , user_id: req.session.user_id })
  let dirPath = dir.user_file_path + "/" + dir.user_file_name
  let files = await Files.delete(({user_file_path: dirPath, user_id: req.session.user_id }))

  console.log('deleted:', dir, files)

  res.json({ message: "dir deleted"})
}
