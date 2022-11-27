import 'dotenv/config';
import express, {json} from 'express';
import {createWriteStream} from 'fs';
import path from 'path';

// HTTP request logger
import morgan from 'morgan';

// Initiate express app
const app = express();

app.disable('x-powered-by');

// Logs server requests which is piped to access.log file
app.use(
  morgan('common', {
    stream: createWriteStream(path.join(process.cwd(), 'logs', 'access.log'), {
      flags: 'a',
    }),
  })
);
app.use('/api', (_req, res) => {
  res.send();
});
// Parses incoming requests with json payload
app.use(json());

export default app;
