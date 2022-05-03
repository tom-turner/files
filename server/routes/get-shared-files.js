const { Files, Directories, JoinFilesTags, Tags } = require('../../models')

module.exports = async (req,res) => {
  console.log('get shared files')

  let tag = await Tags.findBy({ share_slug : req.params.slug })

  if(!tag)
    return res.status(401).json({ error: 'File is not shared' })

  let fileIds = await JoinFilesTags.findAllBy({ tag_id: tag.id })

  if(!fileIds)
    return res.status(401).json({ error: 'File is not shared' })

  let files = await Promise.all(fileIds.map( async ({file_id})=>{
    return await Files.findBy({ id: file_id })
  }))

  if(!files)
    return res.status(401).json({ error: 'File is not shared' })

  let sortedFilesList = files.sort((a,b) => { return a.id - b.id})

  return res.json({ files: sortedFilesList })
}
