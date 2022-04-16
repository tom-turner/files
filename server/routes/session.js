const { Users } = require('../../models')
const bcrypt = require('bcrypt');

module.exports = async function (req, res) {
  const user = await Users.findBy({ email : req.body.email.toLowerCase() });

  if (!user) {
    return res.end();
  }

  const match = await bcrypt.compare(req.body.password, user.hashed_password);

  /*
  if (!match) {
    return res.end()
  }
  */

  req.session.user_id = user.id;
  res.end();
}