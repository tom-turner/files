const { Users } = require('../../models')

module.exports = async (req,res) => {
  let id = res.locals.user.id

  if(!id)
    return res.status(401).json()

  let user = await Users.findBy({ id: id })

  if(!user)
    return res.status(401).json()

  return res.json(user)
}
