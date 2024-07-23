import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://capstone-backend-nbum.onrender.com",
    prepareHeaders: (headers) => {
      const sessionToken = window.sessionStorage.getItem("Token");
      if (sessionToken) {
        headers.set("authorization", `Bearer ${sessionToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: () => ({}),
});
