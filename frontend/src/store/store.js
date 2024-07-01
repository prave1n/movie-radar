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

// const allReducers = combineReducers({
//     user: userReducer ,
// });
const persitConfig = {key:"root",storage, version:1};
const persistedReducer = persistReducer(persitConfig,userReducer);

export const configureTestStore = () => {
  const store = configureStore({
    reducer: {
      user: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  return store;
};