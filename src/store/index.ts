import { configureStore } from "@reduxjs/toolkit";
import { appealsApi } from "./appealsApi";
import { calendarApi } from "./calendarApi";

export const store = configureStore({
  reducer: {
    [appealsApi.reducerPath]: appealsApi.reducer,
    [calendarApi.reducerPath]: calendarApi.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(
      appealsApi.middleware,
      calendarApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;