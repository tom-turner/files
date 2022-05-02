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
  require('./middleware/is-file-owner'),
  require('./routes/get-file')
);

routes.get('/getFile/:id/content',
  require('./middleware/file-with-id-exists'),
  require('./middleware/is-authenticated'),
  require('./middleware/is-file-owner'),
  require('./routes/get-file-content')
);

routes.get('/getShare/:slug',
  require('./routes/get-shared-files')
);

routes.get('/getShare/:slug/:id',
  require('./routes/get-shared-file')
);

routes.get('/getShare/:slug/:id/content',
  require('./routes/get-shared-file-content')
);

routes.get('/searchFiles/*',
  require('./middleware/is-authenticated'),
  require('./routes/search-files')
);

routes.delete('/deleteFile/:id',
  require('./middleware/file-with-id-exists'),
  require('./middleware/is-authenticated'),
  require('./middleware/is-file-owner'),
  require('./routes/delete-file')
);

routes.delete('/deleteTag/:id',
  require('./middleware/is-authenticated'),
  require('./middleware/is-tag-owner'),
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
  require('./middleware/is-file-owner'),
  require('./routes/create-tag')
);

routes.post('/createShare/:id',
  require('./middleware/is-authenticated'),
  require('./middleware/is-tag-owner'),
  require('./routes/create-share')
);

routes.post('/session',
  require('./routes/session')
);

routes.post('/register',
  require('./routes/register')
);

module.exports = routes
