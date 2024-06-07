import { createSlice } from "@reduxjs/toolkit";

const initialState  = {
    authorized: false,
    userid: 0,
    fname : '',
    lname:'',
    email:'',
    watchlist:[]
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        newuser(state, action) {
            state.authorized = true;
            state.userid = action.payload._id;
            state.fname = action.payload.fname;
            state.lname = action.payload.lname;
            state.email = action.payload.email;
            state.watchlist = action.payload.favouriteMovies;
        },
        clearuser(state) {
            state.authorized = false;
            state.userid = 0;
            state.fname = '';
            state.lname = '';
            state.email = '';
            state.watchlist = '';
        },
        addmovie(state, action) {
            state.watchlist = [...state.watchlist, action.payload.movie]
        },
        removemovie(state, action) {
            state.watchlist = action.payload
        }
    },
});

export const {newuser,clearuser, addmovie, removemovie} = userSlice.actions;
export default userSlice.reducer