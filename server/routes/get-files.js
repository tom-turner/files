const { Files, Directories, JoinFilesTags, Tags } = require('../../models')

module.exports = async (req,res) => {
  console.log('get files')
  let path = '/' + req.params[0]

  let fileList = await Files.findAllBy({ user_file_path : path, user_id: res.locals.user.id })
  let dirList = await Directories.findAllBy({ user_file_path : path, user_id: res.locals.user.id })
  
  //let tagList = fileList.map( async (file) => {
  //  let join = await JoinFilesTags.findBy({ file_id: file.id, user_id: res.locals.user.id })
  //  return await Tags.findBy({ id: join.tag_id,  user_id: res.locals.user.id })
  //})

  // console.log(tagList)

  let sortedFilesList = fileList.sort((a,b) => { return a.id - b.id})
  let sortedDirList = dirList.sort((a,b) => { return a.id - b.id})
  //  let sortedTagList = tagList.sort((a,b) => { return a.id - b.id})

  return res.json({ files: sortedFilesList, dirs: sortedDirList })
}
