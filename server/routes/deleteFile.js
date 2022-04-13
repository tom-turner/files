const { Files } = require('../../models')

module.exports = (req,res) => {
  console.log("delete:",req.body)
  Files.delete({id: req.body.id, user_id: 0 })
  // then delete on disk
  res.json({ message: "file deleted"})
}