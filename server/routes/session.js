const { Users } = require('../../models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenSecret = process.env.TOKEN_SECRET

module.exports = async function (req, res) {
  const user = await Users.findBy({ username : req.body.username });

  if (!user)
    return res.status(401).json({ error: 'Check username or password' })

  bcrypt.compare(req.body.password, user.hashed_password, (err, result) => {
    if(err)
      return res.status(500).json({error: 'An error occoured'})
  
    if(!result) { 
      return res.status(401).json({ error: 'Check username or password' })
    } else { 

      let token = jwt.sign({ id: user.id }, tokenSecret)

      res.cookie('token', token, { httpOnly:true })
      res.json({ token: token });
    }
  });  
}
