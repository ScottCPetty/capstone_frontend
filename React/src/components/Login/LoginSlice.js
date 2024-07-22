import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../../api/userApi";

const loginApi = userApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/user/login",
        method: "POST",
        body: credentials,
        responseHandler: (response) => response.text(),
      }),
      invalidateTags: ["User"],
    }),
  }),
});

const storeToken = (state, { payload }) => {
  window.sessionStorage.setItem("Token", payload);
};

const loginSlice = createSlice({
  name: "login",
  initialState: {
    user: {},
    token: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.login.matchFulfilled, storeToken);
  },
});

export default loginSlice.reducer;
export const { useLoginMutation } = loginApi;
