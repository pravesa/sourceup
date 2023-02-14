import {MongoMemoryServer} from 'mongodb-memory-server';

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).__MONGOINSTANCE = instance;
  process.env.TEST_DB_URI = instance.getUri();
  process.env.DB_NAME = 'testdb';
}
