import {hash} from 'bcrypt';

// Salt for hashing password
const saltRounds = 10;

// Initiate user account for testing
// eslint-disable-next-line import/prefer-default-export
export const initiateTestAccount = async () => {
  // Encrypt the password with bcrypt
  const encryptedPwd = await hash('test@123', saltRounds);

  // Mock user account
  const data: User = {
    _id: 'user@test.com',
    pwd: encryptedPwd,
    gstn: '33ABCDE1234F1GH',
    mail: {
      pri: 'user@test.com',
      sec: undefined,
    },
  };

  return data;
};
