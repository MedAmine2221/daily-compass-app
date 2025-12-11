import { ChatState } from "@/src/constants/interfaces";
import { createSlice } from "@reduxjs/toolkit";
const initialState: ChatState = {
    messages: [],
}
const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChat: (state, action) => {
            state.messages.push(action.payload);
        },
        clearChat: (state) => {
            state.messages = [];
        },
    }
});
export const { setChat, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
