const { Users } = require('../../models')

let isAuthenticated = async (req, res, next) => {
  console.log('is-auth user_id:', req.session.user_id)
  const user = await Users.findBy({ id: req.session.user_id});

  if (!user)
    return res.status(401).send()

  next();
}

module.exports = isAuthenticated
