import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";

import reducer from "./reducers";

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
