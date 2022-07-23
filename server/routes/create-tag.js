const { Tags, JoinFilesTags } = require('../../models')

module.exports = async (req,res) => {
  let tagName = req.body.tagName ? req.body.tagName : `New Tag`
  let tagColour = req.body.tagColour ? req.body.tagColour : '#6365f1'

  let tag = await Tags.findBy({ tag_name : tagName, tag_colour: tagColour, user_id: res.locals.user.id })

  if(!tag)
    tag = await Tags.create({
      user_id: res.locals.user.id,
      tag_name: tagName,
      tag_colour: tagColour,
      created_at: new Date().toString()
    })

  return res.json({ success : true, tagId: tag.id })
}
