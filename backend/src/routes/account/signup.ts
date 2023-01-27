import {Request, Response} from 'express';
import {MongoError} from 'mongodb';
import {hash} from 'bcrypt';
import {db, logger} from '../../service';

type UserRegistration = Required<Pick<User, '_id' | 'gstn' | 'mail' | 'pwd'>>;

interface RequestBodyWithPayload extends Request {
  body: {
    payload: Omit<UserRegistration, '_id'> & {
      mail: string;
    };
  };
}

const saltRounds = 10;

// Route handler for registering an User
const signupRoute = async (req: RequestBodyWithPayload, res: Response) => {
  const data = req.body.payload;

  let response: ServerResponse<'Created' | 'Conflict' | 'Bad Request'>;

  try {
    const encPwd = await hash(data.pwd, saltRounds);

    // Insert new organization into collection
    const status = await db.collection<UserRegistration>('users').insertOne({
      _id: data.mail,
      gstn: data.gstn,
      pwd: encPwd,
      mail: {pri: data.mail},
    });

    // Check whether write is successful and send appropriate response
    if (status.acknowledged) {
      logger.info(status.insertedId, 'User Registered Successfully');

      response = {
        status: 201,
        statusText: 'Created',
        message: 'You have been registered successfully.',
      };
    } else {
      // Throw error on unsuccessful write
      throw new Error(
        'There is a temporary error registering your details. Please try again after sometime.'
      );
    }
  } catch (error) {
    // Send response error related to mongodb duplicate id write
    if (error instanceof MongoError && error.code === 11000) {
      const id = error.errmsg.split('{ ')[1].split(':', 1)[0];
      response = {
        status: 409,
        statusText: 'Conflict',
        message: `ID (${
          id === '_id' ? 'email' : id
        }) already exist. Please try with someother ID.`,
      };
      // Send all other errors
    } else {
      response = {
        status: 400,
        statusText: 'Bad Request',
        message: `Something not right. For more details: ${error.message}`,
      };
    }

    logger.error(error);
  }
  // End the request-response cycle
  res.send(response).end();
};

export default signupRoute;
