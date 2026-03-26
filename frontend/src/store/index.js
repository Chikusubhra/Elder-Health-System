import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import healthSlice from './slices/healthSlice';
import alertSlice from './slices/alertSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    health: healthSlice,
    alerts: alertSlice,
  },
});

