import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import { IUserResponse } from '../../../../shared/src/users';

interface AuthState {
    user: IUserResponse | null;
    isAuthenticated: boolean;
}
// Initial authentication state
const initialState : AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserResponse | null>) => {
      state.user = action.payload;
      state.isAuthenticated = state.user ? true: false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;