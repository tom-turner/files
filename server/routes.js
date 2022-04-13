let express = require('express');
let routes = express.Router();

const { Files, Directories } = require('../models')

routes.post('/explorer', require('./routes/getFilesList'));

routes.post('/getFile', require('./routes/getFile'));

routes.post('/uploadFile', require('./routes/uploadFile'));

routes.post('/streamBinary', require('./routes/streamBinary'));

routes.post('/deleteFile', require('./routes/deleteFile'));

routes.post('/createDir', require('./routes/createDirectory'));

routes.post('/deleteDir', require('./routes/deleteDirectory'));


routes.post('/servercheck', (req,res) => {
  console.log('client connected')
  res.json({ message : 'hello client'})
});

module.exports = routes