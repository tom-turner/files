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
  require('./middleware/file-with-id-exists'),
  require('./middleware/is-authenticated'),
  require('./middleware/is-owner'),
  require('./routes/get-file')
);

routes.get('/getFile/:id/content',
  require('./middleware/file-with-id-exists'),
  require('./middleware/is-authenticated'),
  require('./middleware/is-owner'),
  require('./routes/get-file-content')
);

routes.get('/searchFiles/*',
  require('./middleware/is-authenticated'),
  require('./routes/search-files')
);

routes.delete('/deleteFile/:id',
  require('./middleware/file-with-id-exists'),
  require('./middleware/is-authenticated'),
  require('./middleware/is-owner'),
  require('./routes/delete-file')
);

routes.delete('/deleteTag/:id',
  require('./middleware/is-authenticated'),
  require('./middleware/is-owner'),
  require('./routes/delete-tag')
);

routes.put('/uploadFile/:id/content',
  require('./middleware/is-authenticated'),
  require('./routes/upload-file-content')
);

routes.post('/uploadFile',
  require('./middleware/is-authenticated'),
  require('./routes/upload-file')
);

routes.post('/createTag/:id',
  require('./middleware/is-authenticated'),
  require('./middleware/is-owner'),
  require('./routes/create-tag')
);

routes.post('/session',
  require('./routes/session')
);

routes.post('/register',
  require('./routes/register')
);

module.exports = routes
