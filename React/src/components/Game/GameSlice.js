import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/api";

const accountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    account: builder.query({
      query: () => ({
        url: "/api/user/me",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ userId, score }) => ({
        url: `/api/user/${userId}`,
        method: "PUT",
        body: { score },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

const accountSlice = createSlice({
  name: "account",
  initialState: {
    user: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.account.matchFulfilled);
  },
});

export default accountSlice.reducer;
export const { useAccountQuery, useUpdateUserMutation } = accountApi;
