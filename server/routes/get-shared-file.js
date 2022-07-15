const { Files, JoinFilesTags, Tags, Sharing } = require('../../models')

module.exports = async (req,res) => {
  console.log('get shared content')
  
  let sharing = await Sharing.findBy({ share_slug : req.params.slug })

  if(!sharing)
    return res.status(401).json({ error: 'This file  is not shared' })

  let tag = await Tags.findBy({ id : sharing.tag_id })

  if(!tag)
    return res.status(401).json({error: 'This file is not shared'})

  let exists = await JoinFilesTags.findBy({ file_id : req.params.id, tag_id : tag.id })

  if(!exists)
    return res.status(401).json({error: 'This file is not shared'})

  let file = await Files.findBy({ id: req.params.id })

  if(!file)
    return res.status(500).json({error: 'Error: This file might have been shared in the past but now does not exist'})

  res.json({ file })
}
