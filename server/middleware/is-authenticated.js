const { Users } = require('../../models')
const jwt = require('jsonwebtoken');
const tokenSecret = process.env.TOKEN_SECRET

let isAuthenticated = async (req, res, next) => {
  let token = req.header('Authorization')
  if (!token)
    token = req.cookies.token
  else
    res.cookie('token', token, { httpOnly:true })

  if(!token)
    return res.status(401).json({ auth: false, error: 'User not authenticated', redirect: '/login'});

  jwt.verify(token, tokenSecret, async (err, user) => {
    if (err)
      return res.status(401).json({ auth: false, error: 'Invalid auth token', redirect: '/login'});

    let userExists = await Users.findBy({ id: user.id })

    console.log('User exists:', !!userExists)

    if(!userExists)
      return res.status(400).json({ auth: false, error: 'No user exists for this token', redirect: '/login'});

    res.locals.user = user
    next();
  });
}

module.exports = isAuthenticated
