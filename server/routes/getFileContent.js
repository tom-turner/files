const { Files } = require('../../models')

module.exports = async (req,res) => {
  const file = Files.findBy({ id: req.params.id })
  console.log(file)
  /*
  const stream = fs.createWriteStream(file.user_file_name, { flags: 'w' })
  stream
    .on('finish', () => res.end())
    .on('error', (e) => res.status('400').end(JSON.stringify({ error: e.stack })))
  req.pipe(stream) // Whole file isn't stored in memory
  */
  res.json()
}