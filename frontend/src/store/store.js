import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers } from 'redux';
import userReducer from './userSlice';
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
  import storage from 'redux-persist/lib/storage';
  import popupReducer from "./popupSlice";
  import { combineReducers } from 'redux';

const allReducers = combineReducers({
    user: userReducer ,
    popup: popupReducer,
});
const persitConfig = {key:"root",storage, version:1};
const persistedReducer = persistReducer(persitConfig,allReducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
});