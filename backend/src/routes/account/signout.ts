import {Request, Response} from 'express';
import {logger} from '../../service';

// Route handler for deleting user session
const signoutRoute = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    let response: ServerResponse<'OK' | 'Internal Server Error'>;

    if (err) {
      // Set this response for all catched errors
      response = {
        status: 500,
        statusText: 'Internal Server Error',
        message: 'Something went wrong. Please try again.',
      };

      logger.error(err, 'Error clearing user session');

      res.send(response).end();
    }
    // Clear the user session id
    res.clearCookie('SUP_SID');

    response = {
      status: 200,
      statusText: 'OK',
      message: 'You have been signed out successfully',
    };

    res.send(response).end();
  });
};

export default signoutRoute;
