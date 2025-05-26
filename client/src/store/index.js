import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import filesReducer from './slices/filesSlice';
import analyticsReducer from './slices/analyticsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
    analytics: analyticsReducer
  }
});

export default store; 