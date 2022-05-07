const { Tags, JoinFilesTags } = require('../../models')

module.exports = async (req,res) => {
  let fileId = req.params.id
  if(!fileId)
    return res.status(401).send()
  
  let tagName = req.body.tagName ? req.body.tagName : `New Tag`
  let tagColour = req.body.tagColour ? req.body.tagColour : '#6365f1'


  let tag = await Tags.findBy({ tag_name : tagName, tag_colour: tagColour, user_id: res.locals.user.id })

  if(!tag)
    tag = await Tags.create({
      user_id: res.locals.user.id,
      tag_name: tagName,
      tag_colour: tagColour,
      shared: 0,
      created_at: new Date().toString()
    })

  let joinExists = await JoinFilesTags.findBy({ file_id: fileId, tag_id: tag.id, user_id: res.locals.user.id })
  if(joinExists)
    return res.status(200).json({ message: 'join exists already', tagId: joinExists.tag_id }) 
  
  let newJoin = await JoinFilesTags.create({
    user_id: res.locals.user.id,
    tag_id: tag.id,
    file_id: fileId,
    created_at: new Date().toString()
  })

  console.log("created new join to tag:", tagName, fileId)

  return res.json({ success : true, tagId: tag.id })
}
