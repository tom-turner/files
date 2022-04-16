const { Files } = require('../../models')

module.exports = async (req,res) => {
  const file = await Files.findBy({ id: req.params.id, user_id: req.session.user_id })

  res.download( __dirname + `/../../file_storage/${file.checksum}`)
}