import { createSlice } from "@reduxjs/toolkit";

import { SongsSchema } from "../types/songsSchema";

const initialState: SongsSchema = {
    blobCache: {},
    cacheQueue: {}
};

export const songsSlice = createSlice({
    name: "songs",
    initialState,
    reducers: {
        addBlob: (state, action) => {
            state.blobCache[action.payload.id] = action.payload.url;
        },
        setBlobProgress: (state, action) => {
            state.cacheQueue[action.payload.id] = action.payload.progress;
        }
    }
})

export const { actions: songsActions } = songsSlice;
export const { reducer: songsReducer } = songsSlice;
