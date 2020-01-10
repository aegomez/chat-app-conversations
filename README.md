# chat-app-conversations

The conversations service for the chat application. Source written in **TypeScript** (3.7). Runs on **Node.js** and **express**.

## Before starting

### Database

An external database service is needed to save the data.
The default configuration uses MongoDB via [`mongoose`](https://mongoosejs.com/), but you can replace it with a different database/library editing the files in `src/database/`.

### Env variables

The following variables must be defined before running the application:
- `MONGODB_URI`: it is a [MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/) that includes the host, port number and name of a pre-existing database.
- `MONGODB_USER`: the MongoDB username
- `MONGODB_PASS`: the MongoDB password (these two were separated from the URI to avoid some parsing issues that can happen when using special characters in the password).
- `AUTH_API_URI`: the location of the auth service.
- `USER_API_URI`: the location of the users service.
- `PORT`: this is automatically assigned by some services (Heroku, etc.), so be careful before setting it (default 4000).

### Development mode

When running the server with the `run dev` script, the variables are looked from a `.env` file located at the root directory. This is done via the [`env-cmd` package](https://github.com/toddbluhm/env-cmd)

```sh
# .env example
MONGODB_URI=mongodb://192.168.0.1:PORT/database
MONGODB_USER=admin
MONGODB_PASS=secretsauce
NODE_ENV=development
```

## Scripts

```sh
# Install all dependencies
yarn install

# transpile the application from TypeScript source to JavaScript (tsc)
yarn run build

# run tsc in watch mode
yarn run build-watch

# start the application in development mode**
yarn run dev

# start the application is production mode
# don't forget the env variables...
yarn start
```

#### Included Docker configuration

If you don't have a Mongo database available, one solution is to run it as a Docker container.

An example [`docker-compose`](https://docs.docker.com/compose/) file is provided in the `docker/` directory to start a [MongoDB](https://hub.docker.com/_/mongo) service as container and a volume.

You will also need to [set up some environment variables](https://docs.docker.com/compose/environment-variables/) for credentials in the Docker containers. Read the link to find available options depending on the deployment environment.

```sh
## After defining the required env variables
cd docker
docker-compose up
```

### ESLint

The following libraries and plugins are included as devDependencies:
- eslint
- prettier: prettier, config, plugin
- @typescript-eslint: plugin, parser
- typescript + relevant @types packages

See [`.eslintrc.js`](.eslintrc.js) and [`.prettierrc`](.prettierrc) for linter configuration (using recommended *mostly*).

## Author

Adrian Gomez

## License

[MIT](LICENSE)