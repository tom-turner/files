const { Files, Directories } = require('../../models')

module.exports = async (req,res) => {
  console.log('get files')
  let path = '/' + req.params[0]
  let fileList = await Files.findAllBy({ user_file_path : path, user_id: res.locals.user.id })
  let dirList = await Directories.findAllBy({ user_file_path : path, user_id: res.locals.user.id })

  let sortedFilesList = fileList.sort((a,b) => { return a.id - b.id})
  let sortedDirList = dirList.sort((a,b) => { return a.id - b.id})

  return res.json({ files: sortedFilesList, dirs: sortedDirList })
}
