const { Files } = require('../../models')

module.exports = async (req,res) => {
  console.log('get file content')
  const file = await Files.findBy({ id: req.params.id, user_id: res.locals.user.id })
  res.set('Content-Disposition', `attachment; filename="${file.user_file_name}"`)
  res.download( __dirname + `/../../file_storage/${file.checksum}`)
}
