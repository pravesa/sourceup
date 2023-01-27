import 'dotenv/config';
import express, {json} from 'express';
import {existsSync, writeFileSync, createWriteStream} from 'fs';
import path from 'path';

// HTTP request logger
import morgan from 'morgan';

// Api endpoints and route handlers
import {defaultErrorHandler, routeNotFoundHandler} from './handlers';

// Initiate express app
const app = express();

app.disable('x-powered-by');

const accessLog = path.join(process.cwd(), 'logs', 'access.log');

// Create access.log file if not already exist
if (!existsSync(accessLog)) {
  writeFileSync(accessLog, '');
}

// Logs server requests which is piped to access.log file
app.use(
  morgan('common', {
    stream: createWriteStream(accessLog, {
      flags: 'a',
    }),
  })
);

// Parses incoming requests with json payload
app.use(json());

// 404 (Not Found) handler. place this middleware after all routes.
app.use(routeNotFoundHandler);

// Default error handler
app.use(defaultErrorHandler);

export default app;
