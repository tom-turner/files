const { Files } = require('../../models')
const fs = require('fs')

module.exports = async (req, res) => {
  console.log("user id: ", req.session.user_id )
  const file = await Files.findBy({ id: req.params.id })

  if(!file)
    return

  let writeStream = fs.createWriteStream(
    __dirname + `/../../file_storage/${file.checksum}`,
    { flags: 'a' }
  ).on('error', () => {
    console.log('error')
    res.status(500).send()
  })

  req.pipe(writeStream);

  res.status(200).send()
}
