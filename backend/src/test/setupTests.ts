import {db, client} from './../service';
// import {initiateTestAccount} from './setupTestAccount';

// // Setup database connection and initiate user account
// beforeAll(async () => {
//   const data = await initiateTestAccount();

//   // Insert the mock user account to users collection
//   await db.collection<User>('users').insertOne({...data});
// });

// Clean up after the tests are finished.
afterAll(async () => {
  await db.dropCollection('users');
  await db.dropDatabase();
  await client.close();
});
