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
        }, // End of headers
        providesTags: ["Users"], // End of fetchUsers
      }), // end of query
    }), // end of fetchUsers
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/api/user/${userId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        }, // End of headers
      }), // end of query
      invalidatesTags: ["Users"],
    }), // end of deleteUser
    overrideExisting: false,
  }), // end of endpoints builder
}); // end of const adminApi

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
    ); // end of addMatcher
  },
}); // end of createSlice

export default adminSlice.reducer;
export const { useFetchUsersQuery, useDeleteUserMutation } = adminApi;
