require('dotenv').config();
const PORT = process.env.PORT
if(!PORT)
  return console.error('\x1b[33m%s\x1b[0m', 'You must create a .env file!!! consult README.md or contact the developer if you run into issues.')
const express = require('express')
const app = express()
const http = require('http').Server(app);
const routes = require("./routes")
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

//app.use(morgan())
app.use(cors({
  origin: (origin, next) => next(null, origin),
  credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.urlencoded());
app.use(bodyParser.raw({type: '*/*', limit: 1e8}))
app.use(routes)

// Starting the App
const server = http.listen(process.env.PORT || PORT, function() {
  console.log('listening on *:' + PORT);
});
