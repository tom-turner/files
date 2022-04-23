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

app.use((req,res,next)=>{
  let origin = req.headers.origin
  res.set('Access-Control-Allow-Origin', origin)
  res.set('Access-Control-Allow-Credentials', true )
  res.set('Access-Control-Allow-Headers', 'authorization,content-type' )
  res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE' )

  next()
})
app.use(morgan())

app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.urlencoded());
app.use(routes)

// Starting the App
const server = http.listen(process.env.PORT || PORT, function() {
  console.log('listening on *:' + PORT);
});
