import {Router} from 'express';
import signinRoute from './signin';

const accountRouter = Router();

accountRouter.post('/signin', signinRoute);

export default accountRouter;
