const jwt = require('jsonwebtoken');
const tokenSecret = process.env.TOKEN_SECRET

let isAuthenticated = async (req, res, next) => {
  const token = req.header('Authorization')

  if(!token)
    return res.status(401).json({ auth: false, error: 'User not authenticated', redirect: '/login'});

  let user = null
  try {
    user = jwt.verify(token, tokenSecret);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to parse jwt', redirect: '/login' })
  }

  if(!user)
    return res.status(401).json({ auth: false, error: 'User not authenticated', redirect: '/login'});

  res.locals.user = user
  next();
}

module.exports = isAuthenticated
