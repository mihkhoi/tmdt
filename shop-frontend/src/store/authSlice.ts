// src/store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  sub: string; // username
  role?: string; // claim "role" trong JWT
  exp: number;
};

type AuthState = {
  token: string | null;
  username: string | null;
  role: string | null;
};

const tokenFromStorage = localStorage.getItem("token");

let initialState: AuthState = {
  token: null,
  username: null,
  role: null,
};

if (tokenFromStorage) {
  try {
    const decoded = jwtDecode<DecodedToken>(tokenFromStorage);
    initialState = {
      token: tokenFromStorage,
      username: decoded.sub,
      role: decoded.role || null,
    };
  } catch {
    // token lỗi => bỏ qua
    localStorage.removeItem("token");
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      const token = action.payload;
      const decoded = jwtDecode<DecodedToken>(token);
      state.token = token;
      state.username = decoded.sub;
      state.role = decoded.role || null;
      localStorage.setItem("token", token);
    },
    logout(state) {
      state.token = null;
      state.username = null;
      state.role = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
