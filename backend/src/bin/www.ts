#!/usr/bin/env node

import DEBUG from 'debug';
import 'dotenv/config';
import {createServer} from 'http';
import app from '../server';

const debug = DEBUG('node:server');

// Normalize a port into number, string or false
function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; //named pipe
  }
  if (port >= 0) {
    return port; // port number
  }

  return false;
}

// Get port from environment if specified or else fallback to default value
const port = normalizePort(process.env.PORT || '5000');

// Store the port in express app
app.set('port', port);

// Event listener for HTTP Server 'error' event.
function onError(error: {syscall: string; code: string}) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(bind + ' requires elevated privileges');
      process.exitCode = 1;
      throw error;
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(bind + ' is already in use');
      process.exitCode = 1;
      throw error;
    default:
      throw error;
  }
}

// Create http server by binding express app for listening incoming requests
const server = createServer(app);

// Event listener for HTTP Server 'listening' event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'Pipe ' + addr : 'Port ' + addr?.port;
  debug('Listening on ' + bind);
}

// Server will listens on this port
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
