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

