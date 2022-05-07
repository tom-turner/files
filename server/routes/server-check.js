module.exports = (req,res) => {
  console.log('server check')
  res.send({ message: "Server Ok" })
}