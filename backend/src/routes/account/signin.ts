import {Request, Response} from 'express';
import {validatePassword} from '../../lib';
import {db, logger} from '../../service';

interface RequestBodyWithPayload extends Request {
  body: {
    payload: User;
  };
}

// Route handler for authenticating user
const signinRoute = async (req: RequestBodyWithPayload, res: Response) => {
  const client = req.body.payload;

  let response: ServerResponse<
    'OK' | 'Not Found' | 'Unauthorized' | 'Internal Server Error'
  >;

  try {
    // Query the user collection with id
    const user = await db.collection<User>('users').findOne({_id: client._id});

    // If the user id exist
    if (user) {
      response = await validatePassword(client.pwd, user.pwd);

      // Set session cookie once the password provided was validated to be true
      if (response?.status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {pwd, ...data} = {...user};

        req.session.user = {...data};
        response = {...response, payload: {...data}};

        logger.info(user._id, 'signed in successfully');
      }
      // If the user account doesn't exist
    } else {
      response = {
        status: 404,
        statusText: 'Not Found',
        message:
          "User account doesn't exist. Try again with valid credentials.",
      };
    }
  } catch (error) {
    // Set this response for all catched errors
    response = {
      status: 500,
      statusText: 'Internal Server Error',
      message: 'Something went wrong. Please try again.',
    };

    logger.error(error);
  }
  // End the request-response cycle
  res.send(response).end();
};

export default signinRoute;
