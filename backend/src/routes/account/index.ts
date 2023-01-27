import {Router} from 'express';
import signinRoute from './signin';
import signupRoute from './signup';

const accountRouter = Router();

accountRouter.post('/signin', signinRoute);
accountRouter.post('/signup', signupRoute);

export default accountRouter;
