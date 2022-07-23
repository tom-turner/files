let express = require('express');
let routes = express.Router();

routes.get('/server-check',
  require('./middleware/is-authenticated'),
  require('./routes/server-check')
);

routes.get('/get-files/*',
  require('./middleware/is-authenticated'),
  require('./routes/get-files')
);

routes.get('/get-file/:id',
  require('./middleware/file-with-id-exists'),
  require('./middleware/is-authenticated'),
  require('./middleware/is-file-owner'),
  require('./routes/get-file')
);

routes.get('/get-file/:id/content',
  require('./middleware/file-with-id-exists'),
  require('./middleware/is-authenticated'),
  require('./middleware/is-file-owner'),
  require('./routes/get-file-content')
);

routes.get('/get-shared-tags-by-user',
  require('./middleware/is-authenticated'),
  require('./routes/get-shared-tags-by-user')
);

routes.get('/get-shared-files-by-slug/:slug',
  require('./routes/get-shared-files-by-slug')
);

routes.get('/get-share/:slug/:id',
  require('./routes/get-shared-file')
);

routes.get('/get-share/:slug/:id/content',
  require('./routes/get-shared-file-content')
);

routes.get('/search-files/*',
  require('./middleware/is-authenticated'),
  require('./routes/search-files')
);

routes.get('/get-tag-by-sharing-id/:id',
  require('./middleware/is-authenticated'),
  require('./routes/get-tag-by-sharing-id')
);

routes.get('/get-tag-by-id/:id',
  require('./middleware/is-authenticated'),
  require('./routes/get-tag-by-id')
);

routes.get('/get-tag-by-slug/:slug',
  require('./routes/get-tag-by-slug')
);

routes.get('/get-child-tags/:id',
  require('./routes/get-child-tags')
);

routes.get('/get-users-by-shared-tag/:id',
  require('./middleware/is-authenticated'),
  require('./routes/get-users-by-shared-tag')
);

routes.get('/get-files-by-shared-tag/:id',
  require('./middleware/is-authenticated'),
  require('./routes/get-files-by-shared-tag')
);

routes.get('/get-files-by-tag/:id',
  require('./middleware/is-authenticated'),
  require('./routes/get-files-by-tag')
);

routes.get('/chat-history/:id', 
  require('./middleware/is-authenticated'),
  require('./routes/chat-history')
);

routes.delete('/delete-file/:id',
  require('./middleware/file-with-id-exists'),
  require('./middleware/is-authenticated'),
  require('./middleware/is-file-owner'),
  require('./routes/delete-file')
);

routes.delete('/delete-tag/:id',
  require('./middleware/is-authenticated'),
  require('./middleware/is-tag-owner'),
  require('./routes/delete-tag')
);

routes.put('/upload-file/:id/content',
  require('./middleware/is-authenticated'),
  require('./routes/upload-file-content')
);

routes.post('/remove-tag-from-file',
  require('./middleware/is-authenticated'),
  require('./middleware/is-file-owner'),
  require('./routes/remove-tag-from-file')
);

routes.post('/rename-file',
  require('./middleware/is-authenticated'),
  require('./middleware/is-file-owner'),
  require('./routes/rename-file')
);

routes.post('/rename-tag',
  require('./middleware/is-authenticated'),
  require('./middleware/is-file-owner'),
  require('./routes/rename-tag')
);

routes.post('/upload-file',
  require('./middleware/is-authenticated'),
  require('./routes/upload-file')
);

routes.post('/create-tag',
  require('./middleware/is-authenticated'),
  require('./routes/create-tag')
);

routes.post('/create-child-tag',
  require('./middleware/is-authenticated'),
  require('./routes/create-child-tag')
);

routes.post('/create-tag-file-join',
  require('./middleware/is-authenticated'),
  require('./middleware/is-file-owner'),
  require('./routes/create-tag-file-join')
);

routes.post('/create-shared-tag',
  require('./middleware/is-authenticated'),
  require('./routes/create-shared-tag')
);

routes.post('/session',
  require('./routes/session')
);

routes.post('/register',
  require('./routes/register')
);

module.exports = routes
