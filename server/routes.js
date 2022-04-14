let express = require('express');
let routes = express.Router();

const { Files, Directories } = require('../models')

routes.post('/getFiles', require('./routes/getFiles'));

routes.post('/getFile/:id',
  require('./middleware/fileWithIdExists'),
  require('./routes/getFile')
);

routes.post('/getFile/:id/content',
  require('./middleware/fileWithIdExists'),
  require('./routes/getFileContent')
);

routes.post('/deleteFile/:id',
  require('./middleware/fileWithIdExists'),
  require('./routes/deleteFile')
);

routes.post('/uploadFile', require('./routes/uploadFile'));

routes.post('/uploadFile/:id/content', require('./routes/uploadFileContent'));

routes.post('/createDir', require('./routes/createDirectory'));

routes.post('/deleteDir/:id', require('./routes/deleteDirectory'));


routes.post('/servercheck', (req,res) => {
  console.log('client connected')
  res.json({ message : 'hello client'})
});

module.exports = routes