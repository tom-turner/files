## Building The App

1. create a back end .env file using this template in the root directory:
	# Your back end port
	PORT=5001
	# Your JWT secret used for signing user authentication.
	TOKEN_SECRET="secret-jwt-token"
	# your backend registration secret used for creating user accounts.
	REGISTER_SECRET="secret-register-token"
	# Your node environment.
	NODE_ENV="production"	
2. create a client side .env using this template in the /client directory:
	# Your front end port.
	PORT=5002
	# Your back end port, this should match your back end .env.
	REACT_APP_SERVER_PORT=5001
3. run 'npm run build' in the apps root directory - this should install and build the back end and front end with all their dependancies.
4. migrate the database with 'npx db-migrate up -e production'

## Adding Database Migration

1. npx db-migrate create add-whatever with —sql
2. then add the sql to make the change to the up file then npx db-migrate up locally and heroku run bash
3. followed by  npx db-migrate up or npx db-migrate up -e production 


Open database in terminal: sqlite3 development.db or production.db

Shares are done through tags, when sharing a file what happens is a tag is created for that file, the share url then links back to the tag so file within that tag can be changed 

Pipline tasks for files:
- upload file to share on share view
- add exisiting file to share on share view
- remove file from share on share view
- file view
- tag view ( tags and files in that tag, plus tag share/delete )
- add move file ( change file tag ) by select and dragdrop
- fix scrollbar css
- add files to share on home view
- grid/list layouts
- my account section
- add date created to file list
- add recursive folder structures ( add directory column to tags e.g upper level tag id )
- give shared users edit/view privileges, add column to joinsharesusers
- deal with multi file uploads on client side API, callbacks need to return array of file upload progress instead of an object of the last progress returned from upload function.
- deal with switching pages on file upload
- update ui when tag/files are deleted/changed

Bug report
- closing upload dialog prevents it opening again without page refresh
- 
