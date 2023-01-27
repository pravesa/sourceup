import {NextFunction, Request, Response} from 'express';

// Authenticate user session before any route handler that need to be authenticated.
// Pass to next middleware if user session found or send unauthorized error reponse.
const authenticateSessionHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.user) {
    next();
  } else {
    const response: ServerResponse<'Unauthorized'> = {
      status: 401,
      statusText: 'Unauthorized',
      message: 'You are not signed in. Please sign in / sign up to continue.',
    };
    res.send(response).end();
  }
};

export default authenticateSessionHandler;
