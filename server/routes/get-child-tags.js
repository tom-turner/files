const { Tags } = require('../../models')

module.exports = async (req,res) => {
  let id = req.params.id

  if(!id || id === 'undefined')
    return res.status(401).json()

  let childTags = await Tags.findAllBy({ parent_tag: req.params.id })

  if(!childTags)
    return res.status(401).json()

  return res.json(childTags)
}
