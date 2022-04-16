const { Files } = require('../../models')

let isOwner = async (req, res, next) => {
  console.log('is-owner user_id:', req.session.user_id)
  const file = await Files.findBy({ id: req.params.id, user_id: req.session.user_id })

  if (!file)
    return res.status(401).send()

  next();
}

module.exports = isOwner
