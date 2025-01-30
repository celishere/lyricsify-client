import { useEffect, useState, useCallback } from "react";

import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

import classNames from "classnames";

import { playerActions } from "lyricsify/entities/Player/model/slices/playerSlice";

import PREV_SONG from "lyricsify/entities/Room/api/gql/mutations/prev-song.mutation";
import NEXT_SONG from "lyricsify/entities/Room/api/gql/mutations/next-song.mutation";
import CHANGE_PLAYBACK_STATE from "lyricsify/entities/Room/api/gql/mutations/change-playback-state.mutation";

import { getRoom } from "lyricsify/entities/Room/model/selectors/getRoom";

import { normalizeId } from "lyricsify/entities/Room/utils";

import { PrevIcon } from "lyricsify/shared/ui/Icons/PrevIcon";
import { NextIcon } from "lyricsify/shared/ui/Icons/NextIcon";
import { PlayIcon } from "lyricsify/shared/ui/Icons/PlayIcon";
import { PauseIcon } from "lyricsify/shared/ui/Icons/PauseIcon";

import { PlaybackState } from "lyricsify/shared/api/graphql/generated/graphql";

import { useToast } from "lyricsify/shared/lib/hooks/useToast";

import cls from "./Controls.module.scss";

interface ControlsProps {
    mobile?: boolean;
    ref: HTMLAudioElement;
}

export const Controls = ({ mobile, ref }: ControlsProps) => {
    const [needTutorial, setNeedTutorial] = useState(false);
    const [toastId, setToastId] = useState("");

    const [prevSongMutation] = useMutation(PREV_SONG);
    const [nextSongMutation] = useMutation(NEXT_SONG);
    const [changePlaybackMutation] = useMutation(CHANGE_PLAYBACK_STATE);

    const { data: room } = useSelector(getRoom);

    const dispatch = useDispatch();
    const toast = useToast();

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
            const newToastId = toast.error({ message: "Необходимо дать разрешение сайту для проигрывания музыки, для этого нажмите на кнопку Play." });
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


    return (
        <div className={classNames(cls.container, mobile && cls.mobileContainer)}>
            <button
                className={classNames(cls.prevIcon, cls.item)}
                onClick={handlePrevSong}
                aria-label="Previous song"
            >
                <PrevIcon />
            </button>

            <button
                className={cls.item}
                onClickCapture={handlePlayPause}
                aria-label={ref.paused ? "Play" : "Pause"}
            >
                {ref.paused ? <PlayIcon /> : <PauseIcon />}
            </button>

            <button
                className={cls.item}
                onClick={handleNextSong}
                aria-label="Next song"
            >
                <NextIcon />
            </button>
        </div>
    );
};