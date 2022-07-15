const { Shares, JoinSharesTags, Tags, Sharing } = require('../../models')

module.exports = async (req,res) => {
  let tagId = req.params.id

  if(!tagId)
    return res.status(401).send() 

  let tag = await Tags.findBy({id : tagId, user_id: res.locals.user.id })
  
  if(!tag)
    return res.status(401).send() 

  let slug = `share-${tag.id}`

  let sharing = Sharing.findBy({ tag_id: tag.id })

  if(sharing && sharing.share_slug === slug )
      return res.json({ slug: sharing.share_slug})

  await Sharing.create({
    tag_id: tag.id,
    share_slug: slug,
    public: req.params.public || 0
  })

  return res.json({ slug: slug })
}
