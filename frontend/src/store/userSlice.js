import { createSlice } from "@reduxjs/toolkit";

const initialState  = {
    authorized: false,
    userid: 0,
    username:'',
    fname : '',
    lname:'',
    email:'',
    pfp:'',
    watchlist:[],
    friendList:[],
    activityList:[],
};

const userSlice = createSlice({
    name: "user",
    initialState, 
    reducers: {
        newuser(state, action) {
            state.authorized = true;
            state.userid = action.payload._id;
            state.username = action.payload.username;
            state.fname = action.payload.fname;
            state.lname = action.payload.lname;
            state.email = action.payload.email;
            state.pfp = action.payload.pfp;
            state.watchlist = action.payload.favouriteMovies;
            state.friendList = action.payload.friendList;
            state.activityList = action.payload.activityList;
        },
        clearuser(state) {
            state.authorized = false;
            state.userid = 0;
            state.fname = '';
            state.username = '';
            state.lname = '';
            state.email = '';
            state.pfp = '';
            state.watchlist = [];
            state.friendList = [];
            state.activityList = [];
        },
        addmovie(state, action) {
            state.watchlist = [...state.watchlist, action.payload.movie]
        },
        removemovie(state, action) {
            state.watchlist = action.payload
        },
        addFriend(state, action) {
            state.friendList = [...state.friendList, action.payload.friendList]
        }, 
        removeFriend(state, action) {
            state.friendList = action.payload
        }
    },
});

export const {newuser,clearuser, addmovie, removemovie, addFriend, removeFriend} = userSlice.actions;
export default userSlice.reducer