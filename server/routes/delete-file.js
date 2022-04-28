const { Files, JoinFilesTags } = require('../../models')
const fs = require('fs');

module.exports = async (req,res) => {
  let file = await Files.findBy({ id: req.params.id, user_id: res.locals.user.id })
  
  fs.unlink(__dirname + `/../../file_storage/${file.checksum}`, (error) => {
    if(error)  
      return res.status(500).json(error)
    
    Files.delete({ id: req.params.id })
    JoinFilesTags.delete({ file_id: req.params.id })

    return res.json({ success: true })
  })
}
