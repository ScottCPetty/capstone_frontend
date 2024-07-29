import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import loginReducer from "../components/Login/LoginSlice";
import registerReducer from "../components/Register/RegisterSlice";
import adminReducer from "../components/Admin/AdminSlice";
import gameReducer from "../components/Game/GameSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    login: loginReducer,
    register: registerReducer,
    admin: adminReducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
