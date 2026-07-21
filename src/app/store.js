import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setAccessToken, forceLogout } from "./authSlice";
import cartReducer from "./cartSlice";
import { registerAuthHooks } from "../api/axiosInstance";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

// Wire the axios interceptors to Redux *after* the store exists, so a 401
// anywhere in the app can trigger a silent refresh-and-retry, and a failed
// refresh cleanly logs the user out.
registerAuthHooks({
  getToken: () => store.getState().auth.accessToken,
  onRefreshed: (token) => store.dispatch(setAccessToken(token)),
  onRefreshFailed: () => store.dispatch(forceLogout()),
});
