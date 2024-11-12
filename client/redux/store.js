import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@/redux/slice/auth';

const Store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export default Store;