require('dotenv').config();
const PORT = process.env.PORT || 5001;
const express = require('express')
const app = express()
const http = require('http').Server(app);
const routes = require("./routes")
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieSession = require('cookie-session');

app.use(cors({
  origin: 'http://localhost:5000',   
  methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS,PUT",
  credentials: true,               
  allowedHeaders: "Content-Type, Content-Range, Content-Length, Authorization, X-Requested-With, Accept",
}))
app.use(cookieSession({
  name: 'session',
  keys: ['user_id'],
  secret: process.env.COOKIE_SECRET,
}));

app.use(bodyParser.json())
app.use(express.urlencoded());

app.use(routes)

// Starting the App
const server = http.listen(process.env.PORT || PORT, function() {
  console.log('listening on *:' + PORT);
});