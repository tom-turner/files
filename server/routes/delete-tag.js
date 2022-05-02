const { Tags, JoinFilesTags, JoinSharesTags, Shares } = require('../../models')

module.exports = async (req,res) => {
  console.log(req.params.id)
  await Tags.delete({id: req.params.id , user_id: res.locals.user.id })

  res.json({ message: "tag deleted"})
}
