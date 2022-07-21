const { Sharing, JoinSharesUsers, Tags } = require('../../models')

module.exports = async (req,res) => {
  let joins = await JoinSharesUsers.findAllBy({ user_id: res.locals.user.id })

  if(!joins)
    return res.status(401).json()

  let tags = await Promise.all( joins.map( async (join, index ) => {
    let share = await Sharing.findBy({id: join.share_id})
    
    if(!share)
      return await JoinSharesUsers.delete({ id: join.id, user_id: res.locals.user.id })

    let tag = await Tags.findBy({id: share.tag_id})

    if(!tag)
      return Sharing.delete({id: join.share_id, user_id: res.locals.user.id})

    return tag
  }) )

  res.json(tags)
}
