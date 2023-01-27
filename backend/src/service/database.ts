import {MongoClient} from 'mongodb';
import DEBUG from 'debug';
import logger from './logger';

const debug = DEBUG('mongodb:connection');

const DB_CONN_URI = process.env.DB_URI || '';

// Instance of mongodb client
let client: MongoClient;

try {
  client = await new MongoClient(DB_CONN_URI, {
    maxIdleTimeMS: 60 * 1000,
  }).connect();

  logger.info('Database connected successfully');
  debug('Database connected successfully');
} catch (error) {
  logger.error(error, 'connection to database failed');
  debug('connection to database failed');
  process.exit(1);
}

// Create db instance
const db = client.db(process.env.DB_NAME);

export {db, client};
