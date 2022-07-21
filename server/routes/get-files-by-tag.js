const { Sharing, Tags, JoinFilesTags, Files } = require('../../models')

module.exports = async (req,res) => {
  let id = req.params.id

  if(!id || id === 'undefined')
    return res.status(401).json()

  let tag = await Tags.findBy({ id: id, user_id: res.locals.user.id })

  if(!tag)
    return res.status(401).json()

  let files = await JoinFilesTags.findAllBy({ tag_id: tag.id})

  if(!files)
    return res.status(401).json()

  let filesData = await Promise.all( await files.map( async file => {
    return await Files.findBy({id: file.file_id})    
  }))

  return res.json( filesData )
}
