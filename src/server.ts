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
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.post('/api', apiRouteHandler);

// Socket.IO configuration
io.use(getValidateCookies());
io.on('connection', socketManager);

// connect to the database
connect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server up and running on port ${PORT}.`);
    });
  })
  .catch(() => {
    console.error('Connect to DB failed after retries.');
  });
