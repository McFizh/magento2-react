## Running proxy in dev mode

Install required packages:

npm ci

Copy the .env.example file to .env file and modify the database url. Then run the database migrations with command:

npm run db:migrate

Start up the proxy server in watch mode:

npm run watch

Note: The server expects to find shared folder in the root of the repo with config.js file