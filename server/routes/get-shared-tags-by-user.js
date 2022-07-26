const { Sharing, JoinSharesUsers, Tags } = require('../../models')

module.exports = async (req,res) => {
  let joins = await JoinSharesUsers.findAllBy({ user_id: res.locals.user.id })
  let publicShares = await Sharing.findAllBy({ user_id: res.locals.user.id, public: 1 })

  if(!joins)
    return res.status(401).json()

  let privateSharedTags = await Promise.all( joins.map( async (join, index ) => {
    let share = await Sharing.findBy({id: join.share_id})
    
    if(!share)
      return await JoinSharesUsers.delete({ id: join.id, user_id: res.locals.user.id })

    let tag = await Tags.findBy({id: share.tag_id})

    if(!tag)
      return Sharing.delete({id: join.share_id, user_id: res.locals.user.id})

    return tag
  }))

  let publicSharedTags = await Promise.all( await publicShares.map( async share => {
    return await Tags.findBy({id: share.tag_id })
  }))

  let tags = new Map()

  privateSharedTags.map(tag => {
    tags.set(tag.id, tag)
  })

  publicSharedTags.map(tag => {
    tags.set(tag.id, tag)
  })

  res.json([ ...tags.values() ])
}
