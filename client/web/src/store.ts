import {configureStore} from '@reduxjs/toolkit';
import profileReducer from './routes/settings/slices/profileSlice';

const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});
export default store;
