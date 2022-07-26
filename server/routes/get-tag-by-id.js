const { Tags, Sharing } = require('../../models')

module.exports = async (req,res) => {
  let id = req.params.id

  if(!id || id === 'undefined')
    return res.status(401).json()

  let tag = await Tags.findBy({ id: id })

  if(!tag)
    return res.status(401).json()

  let sharing = await Sharing.findBy({ tag_id: id })

  tag.sharing = sharing

  return res.json(tag)
}
