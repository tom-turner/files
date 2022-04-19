const { Users } = require('../../models')
const bcrypt = require('bcrypt');
const saltRounds = 10;
let hashedToken = '$2b$10$9cUxXzeEGew4CWRvCS4ta.4Je8C4LCDEs96Zmp1cw3YT07Jhn.bhi'

module.exports = async function (req, res) {
  let user = await Users.findBy({ username: req.body.username })
  let match = await bcrypt.compare(req.body.token, hashedToken);

  if (user)
    return res.status(500).json({error: 'Username exists'})

  if(!match)
    return res.status(500).json({error: 'Invalid token'})

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if(err){ return res.status(500).json({error: err}) }
    Users.create({
      username: req.body.username,
      hashed_password: hash,
      created_at: new Date()
    })
  });

  return res.json({success: true})
}