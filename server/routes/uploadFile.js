const { Files } = require('../../models')

module.exports = (req,res) => {
  let upload = req.body
  console.log("upload", upload)
  Files.create({
    user_id: 0,
    user_file_name: upload.fileName,
    user_file_path: upload.path.substring(1),
    file_type: upload.fileType,
    last_modified: new Date()
  })
  console.log('file uploaded')
  res.json({ success:true , message: "file uploaded"})
}