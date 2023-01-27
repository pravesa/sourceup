import {Request, Response} from 'express';
import {logger} from '../service';

// Catch all 404 not found paths
const routeNotFoundHandler = (req: Request, res: Response) => {
  let msg = 'Page Not Found';

  // If http method is POST, send route not found message.
  if (req.method === 'POST') {
    msg = 'Route Not Found';
  }

  const response: ServerResponse<'Not Found'> = {
    status: 404,
    statusText: 'Not Found',
    message: msg,
  };

  logger.error({path: req.path, ...response});
  res.send(response).end();
};

export default routeNotFoundHandler;
