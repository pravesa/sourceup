import {Request, Response} from 'express';
import {UpdateFilter} from 'mongodb';
import {db, logger} from '../../service';

interface RequestBodyWithPayload extends Request {
  body: {
    payload: {
      id: string;
      op: 'create' | 'update' | 'delete';
      stock?: Material;
    };
  };
}

// Route handler for inventory update
const rawMaterialRoute = async (req: RequestBodyWithPayload, res: Response) => {
  const client = req.session.user?._id;
  const {id, op, stock} = req.body.payload;

  let response: ServerResponse<
    'OK' | 'Not Modified' | 'Unauthorized' | 'Internal Server Error'
  >;

  try {
    // If the user session exist
    if (client) {
      const updateFilter: UpdateFilter<Inventory> =
        op === 'create'
          ? {$push: {stocks: stock}}
          : op === 'delete'
          ? {$pull: {stocks: {id: id}}}
          : {$set: {'stocks.$[elem]': stock}};

      // Update the inventory collection with modified data
      const result = await db
        .collection<Inventory>('inventory')
        .updateOne({_id: client}, updateFilter, {
          upsert: op === 'create',
          arrayFilters: op === 'update' ? [{'elem.id': id}] : undefined,
        });

      // If the operation is ok
      if (result.acknowledged) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        response = {
          status: 200,
          statusText: 'OK',
          message: 'Inventory updated successfully',
        };

        logger.info(client, 'Inventory updated successfully');
      } else {
        response = {
          status: 304,
          statusText: 'Not Modified',
          message: 'Failed to update Inventory',
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

export default rawMaterialRoute;
