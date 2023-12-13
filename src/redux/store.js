import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import groupSlice from "./slices/groupSlice";
import semesterSlice from "./slices/semesterSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    semesters: semesterSlice.reducer,
    group: groupSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    })
});

export default store;
