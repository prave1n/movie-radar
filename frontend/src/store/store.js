import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers } from 'redux';
import userReducer from './userSlice';

// const allReducers = combineReducers({
//     user: userReducer ,
// });

export default configureStore({
    reducer: {
        user: userReducer 
    }
});