const { Files } = require('../../models')
const fs = require('fs');

module.exports = async (req,res) => {
  let file = await Files.findBy({ id: req.params.id, user_id: req.session.user_id })
  fs.unlink(__dirname + `/../../file_storage/${file.checksum}`, (error) => {
    let response = { success: true }
    if(error) { 
      response = { error: error}
      console.log(error)
    }
    Files.delete({ id: req.params.id, user_id: req.session.user_id })
    return res.json(response)
  })
}