require('dotenv').config();
const PORT = process.env.PORT || 5001;
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
app.use(bodyParser.raw({type: '*/*', limit: '30MB'}))
app.use(routes)

// Starting the App
const server = http.listen(process.env.PORT || PORT, function() {
  console.log('listening on *:' + PORT);
});
