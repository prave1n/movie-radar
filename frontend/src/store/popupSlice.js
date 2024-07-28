import { createSlice } from "@reduxjs/toolkit";

const initialState  = {
    show: false,
    vertical:"top",
    horizontal:"right",
    variant: "error",
    message: ""
};

const popupSlice = createSlice({
    name: "popup",
    initialState, 
    reducers: {
        setPopUp(state, action) {
            state.show = true;
            state.variant = action.payload.variant;
            state.message = action.payload.message;
        },

        popupClose(state) {
            state.show = false
        },

    },
});

export const {setPopUp, popupClose} = popupSlice.actions;
export default popupSlice.reducer