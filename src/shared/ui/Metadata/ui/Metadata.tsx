import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { useMutation } from "@apollo/client";

import classNames from "classnames";

import { getRoom } from "lyricsify/entities/Room/model/selectors/getRoom";
import { extractSongMetadata, normalizeId } from "lyricsify/entities/Room/utils";

import { PrevIcon } from "lyricsify/shared/ui/Icons/PrevIcon";
import { PlayIcon } from "lyricsify/shared/ui/Icons/PlayIcon";
import { PauseIcon } from "lyricsify/shared/ui/Icons/PauseIcon";
import { NextIcon } from "lyricsify/shared/ui/Icons/NextIcon";

import { playerActions } from "lyricsify/entities/Player/model/slices/playerSlice";

import { useToast } from "lyricsify/shared/lib/hooks/useToast";

import { PlaybackState } from "lyricsify/shared/api/graphql/generated/graphql";

import PREV_SONG from "lyricsify/entities/Room/api/gql/mutations/prev-song.mutation";
import NEXT_SONG from "lyricsify/entities/Room/api/gql/mutations/next-song.mutation";
import CHANGE_PLAYBACK_STATE from "lyricsify/entities/Room/api/gql/mutations/change-playback-state.mutation";

import cls from "./Metadata.module.scss";

export interface MetadataProps {
    mobile?: boolean;
    full?: boolean;
    ref: HTMLAudioElement;
}

export const Metadata = ({ mobile, full, ref }: MetadataProps) => {
    const [needTutorial, setNeedTutorial] = useState(false);
    const [toastId, setToastId] = useState("");

    const [prevSongMutation] = useMutation(PREV_SONG);
    const [nextSongMutation] = useMutation(NEXT_SONG);
    const [changePlaybackMutation] = useMutation(CHANGE_PLAYBACK_STATE);

    const { data: room } = useSelector(getRoom);

    const metadata = extractSongMetadata(room);

    const isNoSong = metadata.name === 'NO_SONG';

    const toast = useToast();
    const dispatch = useDispatch();

    const roomId = room?.id ? normalizeId(room.id) : "";
    const playbackState = room?.state;

    useEffect(() => {
        ref.play().catch(() => setNeedTutorial(true));
    }, [ref]);

    useEffect(() => {
        if (!needTutorial) {
            if (toastId) {
                toast.removeToast(toastId);
                setToastId("");
            }
            return;
        }

        if (!toastId) {
            const newToastId = toast.error({
                message: "Необходимо дать разрешение сайту для проигрывания музыки, для этого нажмите на кнопку Play."
            });
            setToastId(newToastId);
        }
    }, [needTutorial, toast, toastId]);


    const handlePlayPause = useCallback(async () => {
        if (needTutorial) {
            ref.play().then(() => {
                if (playbackState === PlaybackState.Play) {
                    ref.pause();
                }
            });
            setNeedTutorial(false);
            return;
        }

        const nextPlaybackState = ref.paused ? PlaybackState.Play : PlaybackState.Pause;
        dispatch(playerActions.setPlayback(nextPlaybackState === PlaybackState.Play));

        try {
            await changePlaybackMutation({
                variables: { roomId, state: nextPlaybackState === PlaybackState.Play ? 1 : 0 },
            });

            if (nextPlaybackState === PlaybackState.Play) {
                await ref.play();
            } else {
                ref.pause();
            }
        } catch (e) {
            console.error("Failed to change playback state", e);
        }
    }, [changePlaybackMutation, dispatch, needTutorial, playbackState, ref, roomId]);

    const handlePrevSong = useCallback(async () => {
        if (!roomId) return;
        try {
            await prevSongMutation({ variables: { roomId } });
        } catch (e) {
            console.error("Failed to play previous song", e);
        }
    }, [prevSongMutation, roomId]);

    const handleNextSong = useCallback(async () => {
        if (!roomId) return;
        try {
            await nextSongMutation({ variables: { roomId } });
        } catch (e) {
            console.error("Failed to play next song", e);
        }
    }, [nextSongMutation, roomId]);

    const isToolbarActive = room?.toolbarActive;
    const isFullscreen = room?.fullscreen;

    return (
        <div
            className={classNames(
                cls.container,
                mobile && cls.containerMobile,
                isNoSong && cls.containerForce,
                full && cls.containerFull
            )}
        >
            {isNoSong ? (
                <span className={cls.title}>
                    Добавь песню в очередь
                </span>
            ) : (!isToolbarActive || isFullscreen) ? (
                <>
                    <span className={cls.title}>{metadata.name}</span>
                    <span className={cls.metadata}>{metadata.artist} — {metadata.album}</span>
                </>
            ) : null}

            {!isNoSong && !isFullscreen && (
                <div className={classNames(cls.controls, {[cls.hidden]: !isToolbarActive})}>
                    <button
                        className={classNames(cls.prevIcon, cls.item)}
                        onClick={handlePrevSong}
                        aria-label="Предыдущий трек"
                    >
                        <PrevIcon/>
                    </button>
                    <button
                        className={cls.item}
                        onClickCapture={handlePlayPause}
                        aria-label={ref.paused ? 'Включить' : 'Пауза'}
                    >
                        {ref.paused ? <PlayIcon/> : <PauseIcon/>}
                    </button>
                    <button
                        className={cls.item}
                        onClick={handleNextSong}
                        aria-label="Следующий трек"
                    >
                        <NextIcon/>
                    </button>
                </div>
            )}
        </div>
    );
};