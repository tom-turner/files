const { Files } = require('../../models')

module.exports = async (req,res) => {
  let deletedFile = await Files.delete({id: req.params.id, user_id: 0 })
  console.log(deletedFile)
  // then delete on disk
  res.json({ deletedFile: deletedFile })
}