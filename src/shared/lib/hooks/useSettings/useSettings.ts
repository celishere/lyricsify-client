import { useCallback } from 'react';
import {useDispatch} from "react-redux";

import {playerActions} from "lyricsify/entities/Player/model/slices/playerSlice";

export const useSettings = () => {
    const dispatch = useDispatch();

    const getSettings = useCallback(() => {
        try {
            const volume = localStorage.getItem('client:volume');
            dispatch(playerActions.setVolume(volume ? Number(volume) : 1));
        } catch (e) {
            setTimeout(() => getSettings(), 200);
        }
    }, [dispatch]);

    return {
        getSettings
    };
};