import {compare} from 'bcrypt';
import {logger} from '../service';

// This function checks the equality of the user provided password and
// stored encrypted password.
const validatePassword = async (
  password: string,
  encryptedPassword: string
) => {
  let response: ServerResponse<'OK' | 'Unauthorized' | 'Internal Server Error'>;

  try {
    const result = await compare(password, encryptedPassword);
    // Authorize user if the password matches
    if (result) {
      response = {
        status: 200,
        statusText: 'OK',
        message: 'You are signed in successfully',
      };
      // Send '401' with incorrect password message if the password doesn't match.
    } else {
      response = {
        status: 401,
        statusText: 'Unauthorized',
        message: 'Incorrect password. Try again with valid password',
      };
    }
  } catch (error) {
    logger.error(error);
    // catch any errors
    response = {
      status: 500,
      statusText: 'Internal Server Error',
      message:
        'Problem occurred while verifying your account. Please try again.',
    };
  }
  return response;
};

export default validatePassword;
