const { Users } = require('../../models')

let isAuthenticated = async (req, res, next) => {

  console.log('is-auth user_id:', req.session.user_id)

  const user = await Users.findBy({ id: req.session.user_id});

  if (!user)
    return res.redirect('http://localhost:5000/login');

  next();
}

module.exports = isAuthenticated
