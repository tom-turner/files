const { Files } = require('../../models')

module.exports = async (req,res) => {
  let fileData = await Files.findBy({ id: req.params.id, user_id: req.session.user_id })
  console.log(fileData)
  res.json({ fileData: fileData })
}