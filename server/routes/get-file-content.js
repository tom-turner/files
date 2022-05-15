const { Files } = require('../../models')
let fs = require('fs');

module.exports = async (req,res) => {
  console.log('get file content')
  const file = await Files.findBy({ id: req.params.id, user_id: res.locals.user.id })
  var src = __dirname + `/../../file_storage/${file.checksum}`;

  res.setHeader('Content-disposition', 'attachment; filename=' + file.user_file_name);
  res.setHeader('Content-type', file.file_type);
  res.download(src, file.user_file_name)
}
