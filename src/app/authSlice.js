import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../api/auth.api";

// ── Silent session restore on app load ───────────────────────────────────
export const restoreSession = createAsyncThunk("auth/restoreSession", async (_, { rejectWithValue }) => {
  try {
    const { data } = await authApi.refreshToken();
    const accessToken = data.data.accessToken;
    const meRes = await authApi.getMe();
    return { accessToken, user: meRes.data.data.user };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Session expired");
  }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authApi.login(payload);
    return { user: data.data.user, accessToken: data.data.accessToken };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await authApi.logout();
  } catch {
    // proceed with local logout regardless
  }
  return true;
});

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await authApi.getMe();
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  status: "idle", // idle | loading | succeeded | failed
  sessionChecked: false, // becomes true once the initial silent refresh completes
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
    forceLogout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.sessionChecked = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.sessionChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setAccessToken, forceLogout } = authSlice.actions;
export default authSlice.reducer;
