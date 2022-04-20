const { Files } = require('../../models')

let fileWithIdExists = async (req, res, next) => {
  let files = await Files.findBy({ id : req.params.id })

  if (!files)
    return res.status('404').end(JSON.stringify({ error: `No file exists for id ${req.params.id}` }))

  next()
}

module.exports = fileWithIdExists
