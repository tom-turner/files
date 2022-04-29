const { Tags, JoinFilesTags, JoinSharesTags, Shares } = require('../../models')

module.exports = async (req,res) => {
  console.log(req.params.id)
  let tag = await Tags.delete({id: req.params.id , user_id: res.locals.user.id })
  await JoinFilesTags.delete({ tag_id: tag.id })
  let share = await JoinSharesTags.delete({ tag_id: tag.id })
  await Shares.delete({ id : share.share_id })

  res.json({ message: "tag deleted"})
}
