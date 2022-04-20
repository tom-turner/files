const { Files } = require('../../models')

module.exports = async (req,res) => {
  console.log('get file data')
  let fileData = await Files.findBy({ id: req.params.id, user_id: res.locals.user.id })
  console.log(fileData)
  res.json( fileData )
}