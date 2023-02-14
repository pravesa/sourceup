import {hash} from 'bcrypt';
import {db} from '../service';

// Salt for hashing password
const saltRounds = 10;

// Initiate user account for testing
// eslint-disable-next-line import/prefer-default-export
export const initiateTestAccount = async () => {
  try {
    // Encrypt the password with bcrypt
    const encryptedPwd = await hash('test@123', saltRounds);

    // Mock user account
    const data: User = {
      _id: 'user@test.com',
      name: 'testuser',
      pwd: encryptedPwd,
      gstn: '33ABCDE1234F1GH',
      mail: {
        pri: 'user@test.com',
        sec: undefined,
      },
    };

    // Insert the mock user account to users collection
    await db.collection<User>('users').insertOne({...data});
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
