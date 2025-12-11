import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: null,
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.items = action.payload;
        },
        clearUser: (state) => {
            state.items = null;
        },
    }
});
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;