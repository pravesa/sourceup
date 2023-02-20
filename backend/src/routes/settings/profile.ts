import {Request, Response} from 'express';
import {db, logger} from '../../service';

interface RequestBodyWithPayload extends Request {
  body: {
    payload: User;
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
const toFlattenObject = (obj: Object, name: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flattenObject: {[k: string]: any} = {};

  Object.entries(obj).forEach((val) => {
    flattenObject[`${name + '.' + val[0]}`] = {...val[1]};
  });
  return flattenObject;
};

// Route handler for user profile update
const profileRoute = async (req: RequestBodyWithPayload, res: Response) => {
  const client = req.session.user?._id;
  const {name, mail, plant, regd, head, warehouse, isHeadSameAsRegd} =
    req.body.payload;

  let response: ServerResponse<
    'OK' | 'Not Modified' | 'Unauthorized' | 'Internal Server Error'
  >;

  try {
    // If the user session exist
    if (client) {
      // Update the user collection with modified data
      const result = await db.collection<User>('users').updateOne(
        {_id: client},
        {
          $set: {
            name: name,
            mail: mail,
            regd: regd,
            head: head,
            ...toFlattenObject(plant ?? {}, 'plant'),
            ...toFlattenObject(warehouse ?? {}, 'warehouse'),
            isHeadSameAsRegd,
          },
        },
        {upsert: false}
      );

      // If the operation is ok
      if (result.acknowledged) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        response = {
          status: 200,
          statusText: 'OK',
          message: 'Profile updated successfully',
        };
        // update user session data
        req.session.user = {...req.session.user, ...req.body.payload};

        logger.info(client, 'profile updated successfully');
      } else {
        response = {
          status: 304,
          statusText: 'Not Modified',
          message: 'Failed to update profile',
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

export default profileRoute;
