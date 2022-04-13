## Adding Database Migration

1. npx db-migrate create add-whatever with —sql
2. then add the sql to make the change to the up file then npx db-migrate up locally and heroku run bash
3. followed by npx db-migrate up -e production which will migrate heroku

