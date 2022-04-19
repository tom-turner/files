const { Users } = require('../../models')
const bcrypt = require('bcrypt');

module.exports = async function (req, res) {
  const user = await Users.findBy({ email : req.body.username });

  if (!user)
    return res.status(500).json({error: 'Invalid Inputs'})

  bcrypt.compare(req.body.password, user.hashed_password, (err, result) => {
    if(err) { return res.status(500).json({error: 'An error occoured'}) }
    
    if(!result) { 
      return res.status(500).json({error: 'Invalid Inputs'})
    } else {
      // set validator
      console.log(`logged in as ${user.email}`)
      req.session.user_id = user.id;
      res.json({success: true});
    }
  });  
}