import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import loginReducer from "../components/Login/LoginSlice";
import registerReducer from "../components/Register/RegisterSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    login: loginReducer,
    register: registerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
