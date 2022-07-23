const { Tags } = require('../../models')

module.exports = async (req,res) => {
  let childId = req.body.childId
  let parentId = req.body.parentId

  if(!childId || ! parentId)
    return res.status(401).send()

  if(childId === parentId)
    return res.status(401).send()

  Tags.update(childId, { parent_tag: parentId })

  return res.json({ success : true })
}
