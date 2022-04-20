const { Files } = require('../../models')

let isOwner = async (req, res, next) => {
  const file = await Files.findBy({ id: req.params.id, user_id: res.locals.user.id })

  if (!file)
    return res.status(401).json({ auth: false, error: 'User not authenticated', redirect: '/login' });

  next();
}

module.exports = isOwner
