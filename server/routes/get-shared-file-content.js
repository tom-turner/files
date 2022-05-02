const { Files, JoinFilesTags, Tags} = require('../../models')

module.exports = async (req,res) => {
  console.log('get shared content')
  
  let tag = await Tags.findBy({ share_slug : req.params.slug })

  if(!tag)
    return res.status(401).send()

  if(!tag.shared || !tag.share_slug)
    return res.status(401).send()

  let exists = await JoinFilesTags.findBy({ file_id : req.params.id, tag_id : tag.id })

  if(!exists)
    return res.status(401).send()

  let file = await Files.findBy({ id: req.params.id })

  if(!file)
    return res.status(401).send()

  res.set('Content-Disposition', `attachment; filename="${file.user_file_name}"`)
  res.download( __dirname + `/../../file_storage/${file.checksum}`)
}
