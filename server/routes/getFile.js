const { Files } = require('../../models')

module.exports = async (req,res) => {
  let fileId = req.body.id

  let fileData = await Files.findBy({ id: fileId, user_id: 0 })

  console.log(fileData)

  res.json({ fileData: fileData })
}