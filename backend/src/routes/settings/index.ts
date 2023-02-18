import {Router} from 'express';
import profileRoute from './profile';

const settingsRouter = Router();

settingsRouter.post('/profile', profileRoute);

export default settingsRouter;
