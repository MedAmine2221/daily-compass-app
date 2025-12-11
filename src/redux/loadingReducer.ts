import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
}
const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setLoadingTrue: (state) => {
            state.loading = true;
        },
        setLoadingFalse: (state) => {
            state.loading = false;
        },
    }
});
export const { setLoadingFalse, setLoadingTrue } = loadingSlice.actions;
export default loadingSlice.reducer;