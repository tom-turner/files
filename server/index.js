require('dotenv').config();
const PORT = process.env.PORT || 5001;
const express = require('express')
const app = express()
const http = require('http').Server(app);
const routes = require("./routes")
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(routes)

// Starting the App
const server = http.listen(process.env.PORT || PORT, function() {
  console.log('listening on *:' + PORT);
});