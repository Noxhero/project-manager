import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../lib/api";
import type { User } from "../../types";

export interface AuthSliceState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthSliceState = {
  user: null,
  token: localStorage.getItem("pm_token"),
  loading: false,
  error: null
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const res = await api.post<{ token: string }>("/auth/login", { email, password });
    const token = res.data.token;
    localStorage.setItem("pm_token", token);
    return token;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }: { email: string; password: string }) => {
    const res = await api.post<{ token: string }>("/auth/register", { email, password });
    const token = res.data.token;
    localStorage.setItem("pm_token", token);
    return token;
  }
);

export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
  // TODO: implement /me endpoint or decode JWT
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("pm_token");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Register failed";
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
