const { Files } = require('../../models')
const fs = require('fs')

module.exports = async (req, res) => {
  const file = await Files.findBy({ id: req.params.id })

  let writeStream = fs.createWriteStream(
    __dirname + `/../../file_storage/${file.location_on_disk}`,
    { flags: 'a' }
  ).on('error', () => {
    console.log('error')
    res.status(500).send()
  })

  req.pipe(writeStream);

  res.status(200).send()
}