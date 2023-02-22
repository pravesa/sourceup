import {Router} from 'express';
import getInventoryRoute from './getInventory';
import rawMaterialRoute from './rawMaterial';

const inventoryRouter = Router();

inventoryRouter.post('/raw-material', rawMaterialRoute);
inventoryRouter.post('/get-inventory', getInventoryRoute);

export default inventoryRouter;
