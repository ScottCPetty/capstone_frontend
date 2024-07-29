import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/api";

const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchUsers: builder.query({
      query: () => ({
        url: "/api/user/all",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
        providesTags: ["Users"],
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/api/user/${userId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      }),
      invalidatesTags: ["Users"],
    }),
    overrideExisting: false,
  }),
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      adminApi.endpoints.fetchUsers.matchFulfilled,
      (state, action) => {
        state.users = action.payload;
      }
    );
  },
});

export default adminSlice.reducer;
export const { useFetchUsersQuery, useDeleteUserMutation } = adminApi;
