const { Files, Directories, JoinFilesTags, Tags } = require('../../models')

module.exports = async (req,res) => {
  console.log('get shared files')

  let tag = await Tags.findBy({ share_slug : req.params.slug })

  let fileIds = await JoinFilesTags.findAllBy({ tag_id: tag.id })

  let files = await Promise.all(fileIds.map( async ({file_id})=>{
    return await Files.findBy({ id: file_id })
  }))

  let sortedFilesList = files.sort((a,b) => { return a.id - b.id})

  return res.json({ files: sortedFilesList })
}
