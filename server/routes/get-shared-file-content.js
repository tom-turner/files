const { Files, JoinFilesTags, Tags, Sharing} = require('../../models')

module.exports = async (req,res) => {
  console.log('get shared content')
  
  let sharing = await Sharing.findBy({ share_slug : req.params.slug })

  if(!sharing)
    return res.status(401).json({ error: 'File is not shared' })

  let tag = await Tags.findBy({ id : sharing.tag_id })

  if(!tag)
    return res.status(401).json({error: 'This file is not shared'})

  let exists = await JoinFilesTags.findBy({ file_id : req.params.id, tag_id : tag.id })

  if(!exists)
    return res.status(401).send()

  let file = await Files.findBy({ id: req.params.id })

  if(!file)
    return res.status(401).send()

  var src = __dirname + `/../../file_storage/${file.checksum}`;

  res.setHeader('Content-disposition', 'attachment; filename=' + file.user_file_name);
  res.setHeader('Content-type', file.file_type);
  res.download(src, file.user_file_name)
}