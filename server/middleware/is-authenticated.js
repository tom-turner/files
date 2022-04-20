const { Users } = require('../../models')
const jwt = require('jsonwebtoken');
const tokenSecret = process.env.TOKEN_SECRET

let isAuthenticated = async (req, res, next) => {
  const token = req.header('Authorization')

  console.log(1, token)

  if(!token)
    return res.status(401).json({ auth: false, error : 'User not authenticated' ,redirect: '/login'});

  const user = jwt.verify(token, tokenSecret);

  if(!user)
    return res.status(401).json({ auth: false, error : 'User not authenticated' ,redirect: '/login'});

  res.locals.user = user
  next();
}

module.exports = isAuthenticated
