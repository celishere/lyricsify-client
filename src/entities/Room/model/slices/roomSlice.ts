import { createSlice } from "@reduxjs/toolkit";

import { RoomSchema } from "../types/roomSchema";

import { PlaybackState } from "lyricsify/shared/api/graphql/generated/graphql";

const initialState: RoomSchema = {
    data: {
        state: PlaybackState.Pause,
        participants: [],
        hostTime: 0.0,
        isHost: false,
        songList: [],
        queue: [],
        toolbarActive: false,
        fullscreen: false,
        lyricsEmpty: false,
        lyricsEnabled: true
    }
};

export const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        load: (state, action) => {
            state.data = action.payload;
        },
        updateUsers: (state, action) => {
            state.data.participants = action.payload;
        },
        setSong: (state, action) => {
            state.data.currentSong = action.payload;
        },
        setQueue: (state, action) => {
            state.data.queue = action.payload;
        },
        setPlayback: (state, action) => {
            state.data.state = action.payload;
        },
        setHostTime: (state, action) => {
            state.data.hostTime = action.payload;
        },
        changeToolbarState: (state, action) => {
            state.data.toolbarActive = action.payload;
        },
        changeFullScreenState: (state, action) => {
            state.data.fullscreen = action.payload;
        },
        changeLyricsState: (state, action) => {
            state.data.lyricsEmpty = action.payload;
        },
        changeLyricsEnableState: (state, action) => {
            state.data.lyricsEnabled = action.payload;
        },
    }
})

export const { actions: roomActions } = roomSlice;
export const { reducer: roomReducer } = roomSlice;
