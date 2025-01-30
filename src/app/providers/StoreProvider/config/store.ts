import { configureStore } from "@reduxjs/toolkit";

import { StateSchema } from "./StateSchema";

import { authReducer } from "lyricsify/entities/Auth/model/slice/authSlice";
import { roomReducer } from "lyricsify/entities/Room/model/slices/roomSlice";
import { playerReducer } from "lyricsify/entities/Player/model/slices/playerSlice";
import { songsReducer } from "lyricsify/entities/Song/model/slices/songsSlice";

export function createReduxStore(initialState?: StateSchema) {
  return configureStore({
    reducer: {
      auth: authReducer,
      room: roomReducer,
      player: playerReducer,
      songs: songsReducer
    },
    devTools: process.env.NODE_ENV === "development",
    preloadedState: initialState,
  });
}
