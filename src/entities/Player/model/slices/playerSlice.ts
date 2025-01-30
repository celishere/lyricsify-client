'use client';
import { createSlice } from "@reduxjs/toolkit";

import { PlayerSchema } from "../types/playerSchema";

const initialState: PlayerSchema = {
    isPaused: false,
    currentTime: 0,
    volume: 0,
    lastChange: 0
};

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setTime: (action, state) => {
            action.currentTime = state.payload;
            console.log('set', state.payload);
        },
        setVolume: (action, state) => {
            action.volume = state.payload;
        },
        setPlayback: (action, state) => {
            action.isPaused = state.payload;
        },
        setChange: (action, state) => {
            action.lastChange = state.payload;
        }
    }
})

export const { actions: playerActions } = playerSlice;
export const { reducer: playerReducer } = playerSlice;
