import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/api";

const gameApi = api.injectEndpoints({
  endpoints: (builder) => ({
    game: builder.query({
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
    score: builder.mutation({
      query: ({ score }) => ({
        url: "/api/user/me",
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

const gameSlice = createSlice({
  name: "game",
  initialState: {
    user: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.game.matchFulfilled);
  },
});

export default gameSlice.reducer;
export const { useGameQuery, useScoreMutation } = gameApi;
