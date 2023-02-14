import {db, client} from './../service';
import {initiateTestAccount} from './setupTestAccount';

// Setup database connection and initiate user account
beforeAll(async () => {
  await initiateTestAccount();
});

// Clean up after the tests are finished.
afterAll(async () => {
  await db.dropCollection('users');
  await db.dropDatabase();
  await client.close();
});
