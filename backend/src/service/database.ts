import {MongoClient} from 'mongodb';

const DB_CONN_URI = process.env.DB_URI || '';

/**
 * Connect to the mongodb using the connection URI and export the
 * mongoclient promise to initiate express app within the promise.
 */
const dbClient = new MongoClient(DB_CONN_URI, {
  maxIdleTimeMS: 60 * 1000,
}).connect();

export default dbClient;
