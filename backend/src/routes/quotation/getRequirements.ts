import {Request, Response} from 'express';
import {db, logger} from '../../service';

// Route handler for retrieving requirements
const getRequirementsRoute = async (req: Request, res: Response) => {
  const client = req.session.user?._id;

  let response: ServerResponse<
    'OK' | 'Not Found' | 'Unauthorized' | 'Internal Server Error'
  >;

  try {
    // If the user session exist
    if (client) {
      // Find the requirements collection for user
      const result = await db
        .collection<Requirements>('requirements')
        .find({}, {projection: {_id: 0}})
        .toArray();

      // If the operation is ok
      if (result) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        response = {
          status: 200,
          statusText: 'OK',
          message: 'Requirements retrieved successfully',
          payload: {requirements: result},
        };

        logger.info(client, 'Requirements retrieved successfully');
      } else {
        response = {
          status: 404,
          statusText: 'Not Found',
          message: 'Could not retrieve requirements',
        };
      }
      // If the user account doesn't exist
    } else {
      response = {
        status: 401,
        statusText: 'Unauthorized',
        message:
          'Unauthorized access. You are not allowed to modify the contents.',
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

export default getRequirementsRoute;
