import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "./calendar/calendarReducer";
import chatReducer from "./chat/chatReducer";
import loadingReducer from "./loadingReducer";
import taskReducer from "./task/taskReducer";
import userReducer from "./user/userReducer";

export const store = configureStore({    
    reducer: {
        user: userReducer,
        chat: chatReducer,
        loading: loadingReducer,
        tasks: taskReducer,
        calendar: calendarReducer,
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;