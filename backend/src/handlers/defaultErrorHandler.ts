import {Request, Response} from 'express';

// Default error handler which will be triggered by next(new Error())
const defaultErrorHandler = (err: ServerError, req: Request, res: Response) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
};

export default defaultErrorHandler;
