let express = require('express');
let routes = express.Router();

routes.get('/servercheck',
  require('./middleware/is-authenticated'),
  require('./routes/server-check')
);

routes.get('/getFiles/*',
  require('./middleware/is-authenticated'),
  require('./routes/get-files')
);

routes.get('/getFile/:id',
  //  require('./middleware/is-owner'),
  require('./middleware/file-with-id-exists'),
  require('./routes/get-file')
);

routes.get('/getFile/:id/content',
  //  require('./middleware/is-owner'),
  require('./middleware/file-with-id-exists'),
  require('./routes/get-file-content')
);

routes.get('/deleteFile/:id',
  //  require('./middleware/is-owner'),
  require('./middleware/file-with-id-exists'),
  require('./routes/delete-file')
);

routes.get('/deleteDir/:id',
  require('./routes/delete-directory')
);

routes.put('/uploadFile/:id/content',
  require('./middleware/is-authenticated'),
  require('./routes/upload-file-content')
);

routes.post('/uploadFile',
  require('./middleware/is-authenticated'),
  require('./routes/upload-file')
);

routes.post('/createDir',
  require('./middleware/is-authenticated'),
  require('./routes/create-directory')
);

routes.post('/session',
  require('./routes/session')
);

module.exports = routes
