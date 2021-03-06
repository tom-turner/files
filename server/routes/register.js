const { Users } = require('../../models')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const registerSecret = process.env.REGISTER_SECRET

module.exports = async function (req, res) {
  let user = await Users.findBy({ username: req.body.username })
  let match = req.body.token === registerSecret

  if (user)
    return res.status(500).json({error: 'Username exists'})

  if(!match)
    return res.status(500).json({error: 'Invalid token'})

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if(err){ return res.status(500).json({error: err}) }
    Users.create({
      username: req.body.username,
      hashed_password: hash,
      created_at: new Date().toString()
    })
  });

  return res.json({success: true})
}