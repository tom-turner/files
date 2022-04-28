const { Files, Directories, JoinFilesTags, Tags } = require('../../models')

module.exports = async (req,res) => {
  console.log('get files')
  let path = '/' + req.params[0]

  let tagList = []
  let dirList = await Directories.findAllBy({ user_file_path : path, user_id: res.locals.user.id })
  let fileList = await Promise.all((await Files.findAllBy({user_file_path : path, user_id: res.locals.user.id })).map( async (file)=>{
    let joins = await JoinFilesTags.findAllBy({ file_id : file.id })
    let fileTags = await Promise.all(joins.map( async (join) =>{
      let tag = await Tags.findBy({ id : join.tag_id })
      tagList.find( obj => obj.id === tag.id ) === undefined ? tagList.push(tag) : console.log(`tag id ${tag.id} already exists in tagList`)
      return tag
    }))
    return {...file, fileTags : fileTags}
  }))

  let sortedFilesList = fileList.sort((a,b) => { return a.id - b.id})
  let sortedDirList = dirList.sort((a,b) => { return a.id - b.id})
  let sortedTagList = tagList.sort((a,b) => { return a.id - b.id})

  return res.json({ files: sortedFilesList, dirs: sortedDirList, tags: sortedTagList })
}
