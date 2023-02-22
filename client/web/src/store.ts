import {configureStore} from '@reduxjs/toolkit';
import userReducer from './routes/account/slices/userSlice';
import inventoryReducer from './routes/inventory/slices/inventorySlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    inventory: inventoryReducer,
  },
});
export default store;
