import {Router} from 'express';
import signinRoute from './signin';
import signupRoute from './signup';
import signoutRoute from './signout';

const accountRouter = Router();

accountRouter.post('/signin', signinRoute);
accountRouter.post('/signup', signupRoute);
accountRouter.delete('/signout', signoutRoute);

export default accountRouter;
