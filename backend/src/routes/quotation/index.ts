import {Router} from 'express';
import getQuotationsRoute from './getQuotations';
import getRequirementsRoute from './getRequirements';
import updateQuotationsRoute from './updateQuotation';

const quotationRouter = Router();

quotationRouter.post('/get-requirements', getRequirementsRoute);
quotationRouter.post('/get-quotations', getQuotationsRoute);
quotationRouter.post('/update-quotations', updateQuotationsRoute);

export default quotationRouter;
