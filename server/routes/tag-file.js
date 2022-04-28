const { Tags, JoinFilesTags } = require('../../models')

module.exports = async (req,res) => {

  console.log('hello')

  if(!req.body.fileId)
    return res.status(401).send()
  
  if(!req.body.tagName)
    req.body.tagName = 'New Tag'

  if(!req.body.tagColour)
    req.body.tagColour = '#6365f1'

  let tag = await Tags.findBy({ tag_name : req.body.tagName, tag_colour: req.body.tagColour })
  console.log(tag)
  if(!tag)
    tag = await Tags.create({
      user_id: res.locals.user.id,
      tag_name: req.body.tagName,
      tag_colour: req.body.tagColour,
      created_at: new Date().toString()
    })

  console.log(tag)

  let joinExists = await JoinFilesTags.findAllBy({ file_id: req.body.fileId, tag_id: tag.id })
  if(joinExists.length != 0)
    return res.status(401).json('join exists already') 
  

  let newJoin = await JoinFilesTags.create({
    user_id: res.locals.user.id,
    tag_id: tag.id,
    file_id: req.body.fileId,
    created_at: new Date().toString()
  })

  console.log(3, newJoin)


  return res.json({message: 'hello'})
}
