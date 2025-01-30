import { createSlice } from "@reduxjs/toolkit";

import { AuthSchema } from "../types/authSchema";

const initialState: AuthSchema = {
    isLoading: true,
    isLoggedIn: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        load: (state) => {
            state.isLoading = true;
            state.isLoggedIn = false;
        },
        authenticate: (state) => {
            state.isLoading = false;
            state.isLoggedIn = true;
        },
        deAuthenticate: (state) => {
            state.isLoading = false;
            state.isLoggedIn = false;
        },
    }
})

export const { actions: authActions } = authSlice;
export const { reducer: authReducer } = authSlice;
