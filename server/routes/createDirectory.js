const { Directories } = require('../../models')

module.exports = (req,res) => {
  let upload = req.body

  if(!upload.fileName){
    console.log('error')
    return res.status(401).json('please choose a folder name')
  }

  console.log("upload path:", upload.path)

  Directories.create({
    user_id: 0,
    user_file_name: upload.fileName,
    user_file_path: upload.path.substring(1),
    last_modified: new Date()
  })
  console.log('dir created')
  res.json({ message: "dir created"})
}
