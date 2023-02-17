import {Router} from 'express';
import signinRoute from './signin';
import signupRoute from './signup';
import signoutRoute from './signout';
import {authenticateSessionHandler} from '../../handlers';

const accountRouter = Router();

accountRouter.post('/signin', signinRoute);
accountRouter.post('/signup', signupRoute);
accountRouter.delete('/signout', authenticateSessionHandler, signoutRoute);

export default accountRouter;
