const { Sharing, Tags } = require('../../models')

module.exports = async (req,res) => {
  let id = req.params.id

  if(!id || id === 'undefined')
    return res.status(401).json()

  let sharing = await Sharing.findBy({ id: req.params.id })

  if(!sharing)
    return res.status(401).json()

  let tag = await Tags.findBy({ id: sharing.tag_id })

  if(!tag)
    return res.status(401).json()

  return res.json(tag)
}