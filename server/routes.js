let express = require('express');
let routes = express.Router();
let files = require('../lib/fileSystem')

const { Files, Directories } = require('../models')

routes.post('/explorer', require('./routes/getFilesList'));

routes.post('/uploadFile', require('./routes/uploadFile'));

routes.post('/deleteFile', require('./routes/deleteFile'));

routes.post('/createDir', require('./routes/createDirectory'));

routes.post('/deleteDir', require('./routes/deleteDirectory'));


routes.post('/servercheck', (req,res) => {
  console.log('client connected')
  res.json({ message : 'hello client'})
});

module.exports = routes