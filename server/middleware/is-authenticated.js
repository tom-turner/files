let isAuthenticated = async (req, res, next) => {
  console.log('is-auth user_id:', req.header('Authorization'))

  if (req.header('Authorization') !== 'test')
    return res.status(401).send()

  next();
}

module.exports = isAuthenticated
