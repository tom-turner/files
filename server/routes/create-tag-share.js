const { Shares, JoinSharesTags, Tags } = require('../../models')

module.exports = async (req,res) => {
  let tagId = req.params.id

  if(!tagId)
    return res.status(401).send() 

  let tag = await Tags.findBy({id : tagId, user_id: res.locals.user.id })
  
  if(!tag)
    return res.status(401).send() 

  let shareHost = `${req.protocol}//${req.hostname}:${process.env.PORT}/sharetag`
  let joinExists = await JoinSharesTags.findBy({ tag_id: tag.id, user_id: res.locals.user.id })

  if(joinExists){
    let shareExists = await Shares.findBy({ id : joinExists.share_id, user_id: res.locals.user.id })
    console.log('share exists')
    if(shareExists)
      return res.json({ url:`${shareHost}/${shareExists.id}` })
  }

  let share = await Shares.create({
    user_id: res.locals.user.id,
    url: '',
    created_at: new Date().toString()
  })

  let join = await JoinSharesTags.create({
    user_id: res.locals.user.id,
    tag_id: tagId,
    share_id: share.id,
    created_at: new Date().toString()
  })

  return res.json({ url: `${shareHost}/${share.id }` })

}
