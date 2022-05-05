const { Tags, JoinFilesTags } = require('../../models')

module.exports = async (req,res) => {
  console.log(req.body)
  await JoinFilesTags.delete({file_id: req.body.fileId, tag_id: req.body.tagId,  user_id: res.locals.user.id })

  res.json({ message: "tag deleted"})
}
