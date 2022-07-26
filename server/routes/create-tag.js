const { Tags, JoinFilesTags, Sharing, JoinSharesUsers } = require('../../models')

module.exports = async (req,res) => {
  let name = req.body.name || `Untitled`
  let colour = req.body.colour || '#6365f1'
  let sharing = req.body.sharing

  let tag = await Tags.create({
      user_id: res.locals.user.id,
      tag_name: name,
      tag_colour: colour,
      created_at: new Date().toString()
    })

  if(!sharing)
    return res.json( tag.id )

  let newShare = await Sharing.create({
    user_id: res.locals.user.id,
    tag_id: tag.id,
    share_slug: `share-${tag.id}`,
    public: sharing.public ? 1 : 0
  })

  await JoinSharesUsers.create({
    user_id: res.locals.user.id,
    share_id: newShare.id
  })

  if(!sharing.sharedWith)
    return res.json( tag.id )

  //
  // to impliment dealing with sharing this created file with other users
  //

  return res.json( tag.id )
}
