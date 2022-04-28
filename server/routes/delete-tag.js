const { Tags, Files } = require('../../models')

module.exports = async (req,res) => {
  let tag = await Tags.delete({id: req.params.id , user_id: res.locals.user.id })

  console.log('deleted:', tag, files)

  res.json({ message: "tag deleted"})
}
