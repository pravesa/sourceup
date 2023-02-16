import 'dotenv/config';
import express, {json} from 'express';
import {existsSync, writeFileSync, createWriteStream} from 'fs';
import path from 'path';

// HTTP request logger
import morgan from 'morgan';

// Database and session modules
import session from 'express-session';
import MongoStore from 'connect-mongo';
import {client} from './service';

// Api endpoints and route handlers
import {
  authenticateSessionHandler,
  defaultErrorHandler,
  getSessionHandler,
  routeNotFoundHandler,
} from './handlers';
import {accountRouter} from './routes';

// Initiate express app
const app = express();

app.disable('x-powered-by');

if (process.env.NODE_ENV !== 'test') {
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
}

// Parses incoming requests with json payload
app.use(json());

// Session middleware using connect-mongo
app.use(
  session({
    name: 'SUP_SID',
    store: MongoStore.create({
      client,
      dbName: process.env.DB_NAME,
      collectionName: 'session',
    }),
    secret:
      process.env.SESSION_SECRET?.split(', ') ??
      'JvHVjmv86HGTXDKxfd7868XGFgfch',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

// User account handler
app.use('/s/api/account', accountRouter);

// Authenticate user session. This should be placed after signin / signup route.
// Otherwise, those routes cannot be accessed without authentication.
app.use(authenticateSessionHandler);

// Get user session
app.get('/s/api/verify-session', getSessionHandler);

// 404 (Not Found) handler. place this middleware after all routes.
app.use(routeNotFoundHandler);

// Default error handler
app.use(defaultErrorHandler);

export default app;
