import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/api";

const homeApi = api.injectEndpoints({
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
    overrideExisting: false,
  }),
});

const adminSlice = createSlice({
  name: "home",
  initialState: {
    users: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      homeApi.endpoints.fetchUsers.matchFulfilled,
      (state, action) => {
        state.users = action.payload;
      }
    );
  },
});

export default adminSlice.reducer;
export const { useFetchUsersQuery } = homeApi;
