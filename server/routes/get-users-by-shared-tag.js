const { Sharing, JoinSharesUsers } = require('../../models')

module.exports = async (req,res) => {
  let users = await JoinSharesUsers.findAllBy({ share_id: res.params.id})

  if(!users)
    return res.status(401).json()

  return res.json(users)
}
