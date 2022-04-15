let express = require('express');
let routes = express.Router();

routes.options('*', (req, res) => res.send())

routes.post('/getFiles',
  require('./routes/getFiles')
);

routes.post('/getFile/:id',
  require('./middleware/fileWithIdExists'),
  require('./routes/getFile')
);

routes.get('/getFile/:id/content',
  require('./middleware/fileWithIdExists'),
  require('./routes/getFileContent')
);

routes.post('/deleteFile/:id',
  require('./middleware/fileWithIdExists'),
  require('./routes/deleteFile')
);

routes.post('/uploadFile',
  require('./routes/uploadFile')
);

routes.put('/uploadFile/:id/content',
  require('./routes/uploadFileContent')
);

routes.post('/createDir',
  require('./routes/createDirectory')
);

routes.post('/deleteDir/:id',
  require('./routes/deleteDirectory')
);

routes.post('/servercheck', (req,res) => {
  console.log('client connected')
  res.json({ message : 'hello client'})
});

module.exports = routes