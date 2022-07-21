const { Tags, JoinFilesTags, Sharing, JoinSharesUsers } = require('../../models')

module.exports = async (req,res) => {
  let tag = await Tags.findBy({id: req.params.id , user_id: res.locals.user.id })

  if(!tag)
    return res.status(401).json()

  let sharing = await Sharing.findBy({ tag_id: tag.id })
  let children = await Tags.findAllBy({ parent_tag: tag.id })
  
  if(sharing) {
    let joins = await JoinSharesUsers.findAllBy({ share_id : sharing.id }) || []
    joins.map( async join => {
      await JoinSharesUsers.delete({ id: join.id })
    })
    await Sharing.delete({ id: sharing.id})
  }

  if(children){
    children.map( async child => {
      await JoinFilesTags.delete({ tag_id: child.id })
      await Tags.delete({ id: child.id })
    })
  }

  await JoinFilesTags.delete({ tag_id: tag.id })
  await Tags.delete({id: tag.id })

  //
  // Should i also delete files from disk too???
  //
  
  res.json({ message: "tag deleted"})
}
