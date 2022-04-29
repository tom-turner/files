const { Files, Directories, JoinFilesTags, Tags } = require('../../models')

module.exports = async (req,res) => {
  console.log('search files')
  let path = '/' + req.params[0]
  let search = req.query.search

  let userFiles = await Files.findAllBy({ user_id: res.locals.user.id })
  let userDirs = await Directories.findAllBy({ user_id: res.locals.user.id })
  let userTags = await Tags.findAllBy({ user_id: res.locals.user.id  })

  let filesInSearch = userFiles.filter((file) =>{
    return file.user_file_name.toLowerCase().includes(search.toLowerCase())
  }) || []

  let dirsInSearch = userDirs.filter((file) =>{
    return file.user_file_name.toLowerCase().includes(search.toLowerCase())
  }) || []

  let tagsInSearch = userTags.filter((file) =>{
    return file.tag_name.toLowerCase().includes(search.toLowerCase())
  }) || []

  await Promise.all(tagsInSearch.map( async (tag) => {
    let joins = await JoinFilesTags.findAllBy({ tag_id : tag.id })
    joins.map( async (join) => {
      let file = await Files.findBy({ id: join.file_id})
      if(!file)
        return
      
      filesInSearch.find( obj => obj.id === file.id ) === undefined ? filesInSearch.push(file) : console.log(`file id ${file.id} already exists in tagList`)
    })
  }))

  let fileList = await Promise.all(filesInSearch.map( async (file)=>{
    let joins = await JoinFilesTags.findAllBy({ file_id : file.id })
    let fileTags = await Promise.all(joins.map( async (join) =>{
      let tag = await Tags.findBy({ id : join.tag_id })
      if(!tag)
        return

      tagsInSearch.find( obj => obj.id === tag.id ) === undefined ? tagsInSearch.push(tag) : console.log(`tag id ${tag.id} already exists in tagList`)
      return tag
    }))
    return {...file, fileTags : fileTags}
  }))

  let sortedFilesList = fileList.sort((a,b) => { return a.id - b.id})
  let sortedDirList = dirsInSearch.sort((a,b) => { return a.id - b.id})
  let sortedTagList = tagsInSearch.sort((a,b) => { return a.id - b.id})

  return res.json({ files: sortedFilesList, dirs: sortedDirList, tags: sortedTagList })
}
