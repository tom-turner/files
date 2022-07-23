const { Sharing, Tags } = require('../../models')

module.exports = async (req,res) => {
  let slug = req.params.slug

  if(!slug || slug === 'undefined')
    return res.status(401).json()

  let sharing = await Sharing.findBy({ share_slug: req.params.slug })

  if(!sharing)
    return res.status(401).json()

  let tag = await Tags.findBy({ id: sharing.tag_id })

  if(!tag)
    return res.status(401).json()

  return res.json(tag)
}
