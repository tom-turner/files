const { Tags } = require('../../models')

let isOwner = async (req, res, next) => {
  const tag = await Tags.findBy({ id: req.params.id, user_id: res.locals.user.id })

  if (!tag)
    return res.status(401).json({ auth: false, error: 'User not authenticated', redirect: '/login' });

  next();
}

module.exports = isOwner
