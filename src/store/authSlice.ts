import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../services/auth";
import type { RootState } from "./index";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};
type AuthState = {
  user: AuthUser | null;
};

const slice = createSlice({
  name: "auth",
  initialState: { user: null } as AuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        console.log({ payload });
        state.user = payload.data;
      }
    );
  },
});

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
