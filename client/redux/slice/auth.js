import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn(state, action) {
      state.isLoggedIn = !state.isLoggedIn;
    }
  },
});

export const { setLoggedIn } = authSlice.actions;

export default authSlice.reducer;