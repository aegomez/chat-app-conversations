import { Server } from 'http';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import socketIO from 'socket.io';

import { apiRouteHandler } from './api';
import { connect } from './db/connection';
import { getValidateCookies } from './utils';
import { socketManager } from './sockets';

const PORT = process.env.PORT || 4000;

const app = express();
const server = new Server(app);
const io = socketIO(server, { serveClient: false });

// express middleware
app.use(express.json());
app.use(compression());
app.use(morgan('dev'));

// connect to the database
connect()
  .then(() => {
    console.log('Successfully connected to DB.');
  })
  .catch((error: Error) => {
    console.error('Could not connect to the database: ', error.message);
  });

app.post('/api', apiRouteHandler);

// Socket.IO configuration
io.use(getValidateCookies());
io.on('connection', socketManager);

server.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}.`);
});
