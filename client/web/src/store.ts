import {configureStore} from '@reduxjs/toolkit';
import userReducer from './routes/account/slices/userSlice';
import inventoryReducer from './routes/inventory/slices/inventorySlice';
import quotationReducer from './routes/quotation/slices/quotationSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    inventory: inventoryReducer,
    quotation: quotationReducer,
  },
});
export default store;
