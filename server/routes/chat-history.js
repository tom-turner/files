const { Sharing, ChatHistory } = require('../../models')

module.exports = async (req,res) => {
  let chatHistory = ChatHistory.findAllBy({ share_id: res.params.id })

  res.json(chatHistory)

}
