const { Files, JoinFilesTags, Tags} = require('../../models')

module.exports = async (req,res) => {
  console.log('get shared content')
  
  let tag = await Tags.findBy({ share_slug : req.params.slug })

  if(!tag || !tag.shared || !tag.share_slug)
    return res.status(401).send()

  let exists = await JoinFilesTags.findBy({ file_id : req.params.id, tag_id : tag.id })

  if(!exists)
    return res.status(401).send()

  let file = await Files.findBy({ id: req.params.id })

  if(!file)
    return res.status(401).send()

  console.log(file)

  var src = __dirname + `/../../file_storage/${file.checksum}`;

  res.setHeader('Content-disposition', 'attachment; filename=' + file.user_file_name);
  res.setHeader('Content-type', file.file_type);
  res.download(src, file.user_file_name)
}
