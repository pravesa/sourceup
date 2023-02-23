import {Request, Response} from 'express';
import {db, logger} from '../../service';

interface RequestBodyWithPayload extends Request {
  body: {
    payload: {
      [k: string]: {
        [k: string]: Array<{quotedAt: Date; rate: number}>;
      };
    };
  };
}

// Route handler for quotations update
const updateQuotationsRoute = async (
  req: RequestBodyWithPayload,
  res: Response
) => {
  const client = req.session.user?._id;

  let response: ServerResponse<
    'OK' | 'Not Modified' | 'Unauthorized' | 'Internal Server Error'
  >;

  try {
    // If the user session exist
    if (client) {
      // Update the quotations collection with modified data
      const result = await db.collection<Quotations>('quotations').updateOne(
        {_id: client},
        {$set: {...req.body.payload}},
        {
          upsert: true,
        }
      );

      // If the operation is ok
      if (result.acknowledged) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        response = {
          status: 200,
          statusText: 'OK',
          message: 'Quotations updated successfully',
        };

        logger.info(client, 'Quotations updated successfully');
      } else {
        response = {
          status: 304,
          statusText: 'Not Modified',
          message: 'Failed to update quotations',
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

export default updateQuotationsRoute;
