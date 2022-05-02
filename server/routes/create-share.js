const { Shares, JoinSharesTags, Tags } = require('../../models')

module.exports = async (req,res) => {
  let tagId = req.params.id

  if(!tagId)
    return res.status(401).send() 

  let tag = await Tags.findBy({id : tagId, user_id: res.locals.user.id })
  
  if(!tag)
    return res.status(401).send() 

  let slug = `share-${tag.id}`

  if(tag.shared && tag.share_slug === slug )
      return res.json({ slug: tag.share_slug})

  await Tags.update( tag.id, {
    share_slug: slug,
    shared: 1
  })

  return res.json({ slug: slug })
}
