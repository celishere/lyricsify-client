import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getRoom } from "lyricsify/entities/Room/model/selectors/getRoom";
import { roomActions } from "lyricsify/entities/Room/model/slices/roomSlice";
import { LyricsIcon } from "lyricsify/shared/ui/Icons/LyricsIcon";

import cls from "./ToggleLyrics.module.scss";

export const ToggleLyrics = () => {
    const { data } = useSelector(getRoom);
    const dispatch = useDispatch();

    const toggleLyrics = useCallback(() => {
        dispatch(roomActions.changeLyricsEnableState(!data.lyricsEnabled));
    }, [dispatch, data.lyricsEnabled]);

    useEffect(() => {
        toggleLyrics();
    }, [toggleLyrics]);

    return (
        <div className={`${cls.Container} ${data.toolbarActive ? "" : cls.fadeOut}`}>
            <button onClick={toggleLyrics}>
                <LyricsIcon active={data.lyricsEnabled} />
            </button>
        </div>
    );
};