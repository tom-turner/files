const { Tags, Sharing, JoinSharesUsers } = require('../../models')

module.exports = async (req,res) => {
  let tagName = req.body.tagName ? req.body.tagName : `New Tag`
  let tagColour = req.body.tagColour ? req.body.tagColour : '#6365f1'

  let tag = await Tags.findBy({ tag_name : tagName, tag_colour: tagColour, user_id: res.locals.user.id })

  if(!tag)
    tag = await Tags.create({
      user_id: res.locals.user.id,
      tag_name: tagName,
      tag_colour: tagColour,
      shared: 0,
      created_at: new Date().toString()
    })


  let sharing = await Sharing.findBy({ tag_id: tag.id })

  if(!sharing)
    sharing = await Sharing.create({
      user_id: res.locals.user.id,
      tag_id: tag.id,
      share_slug: `share-${tag.id}`,
      public: req.params.public || 0
    })

  let join = await JoinSharesUsers.findBy({
    user_id: res.locals.user.id,
    share_id: sharing.id
  })

  if(!join)
    await JoinSharesUsers.create({
      user_id: res.locals.user.id,
      share_id: sharing.id
    })

  return res.json( tag.id )
}
