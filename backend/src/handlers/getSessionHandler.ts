import {Request, Response} from 'express';

// Send user details if session found
const getSessionHandler = (req: Request, res: Response) => {
  const response: ServerResponse<'OK'> = {
    status: 200,
    statusText: 'OK',
    message: 'User session exist.',
    payload: {...req.session.user},
  };

  res.send(response).end();
};

export default getSessionHandler;
