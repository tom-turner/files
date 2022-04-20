module.exports = (req,res) => {
  console.log('server check')
  res.send({ up: true })
}