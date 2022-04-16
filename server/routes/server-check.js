module.exports = (req,res) => {
  console.log('client connected')
  res.send({ up: true })
}