import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../../api/userApi";

const registerApi = userApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/api/user/register",
        method: "POST",
        body: credentials,
        responseHandler: (response) => response.text(),
      }),
      invalidateTags: ["User"],
    }),
  }),
});

const storeToken = (state, { payload }) => {
  window.sessionStorage.setItem("Token", payload.token);
};

const registerSlice = createSlice({
  name: "register",
  initialState: {
    user: {},
    token: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.register.matchFulfilled, storeToken);
  },
});

export default registerSlice.reducer;
export const { useRegisterMutation } = registerApi;
