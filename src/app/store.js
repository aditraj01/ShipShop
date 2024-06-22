import { configureStore } from '@reduxjs/toolkit';
import { itemReducer } from '../reducers/itemReducer';
import { authReducer } from '../reducers/authReducer';

//Creating the store
export const store = configureStore({
  reducer: {
    itemReducer,
    authReducer
  }
});
