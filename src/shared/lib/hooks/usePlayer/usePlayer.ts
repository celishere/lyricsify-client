import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@apollo/client";

import { getRoom } from "lyricsify/entities/Room/model/selectors/getRoom";
import { getAudioUrl, normalizeId } from "lyricsify/entities/Room/utils";
import { getPlayer } from "lyricsify/entities/Player/model/selectors/getPlayer";
import { playerActions } from "lyricsify/entities/Player/model/slices/playerSlice";
import { log, LOGGER_COLORS } from "lyricsify/shared/const/logger";

import UPDATE_CURRENT_TIME from "lyricsify/entities/Room/api/gql/mutations/update-current-time.mutation";
import NEXT_SONG from "lyricsify/entities/Room/api/gql/mutations/next-song.mutation";

export const usePlayer = () => {
    const [updateCurrentTime] = useMutation(UPDATE_CURRENT_TIME);
    const [nextSong] = useMutation(NEXT_SONG);
    const audioRef = useRef<HTMLAudioElement>(new Audio(undefined));
    const [audioUrl, setAudioUrl] = useState<string>("");
    const [lastInteract, setLastInteract] = useState<number>(0);
    const { data } = useSelector(getRoom);
    const { isPaused, volume, currentTime, lastChange } = useSelector(getPlayer);
    const dispatch = useDispatch();


    const canInteract = useCallback(() => {
        const now = Date.now();
        if (now - lastInteract < 500) return false;
        setLastInteract(now);
        return true;
    }, [lastInteract]);

    const canSync = useCallback(() => {
        const now = Date.now();
        if (now - lastInteract < 1500) return false;
        setLastInteract(now);
        return true;
    }, [lastInteract]);


    const handleTimeUpdate = useCallback((e: any) => {
        if (Math.abs(currentTime - (e.target.currentTime || 0)) > 1) {
            dispatch(playerActions.setTime(e.target.currentTime));
        }

        if (data.isHost) {
            updateCurrentTime({
                variables: {
                    roomId: normalizeId(data.id),
                    time: e.target.currentTime
                }
            });
        } else {
            const timeDifference = Math.abs(e.target.currentTime - data.hostTime);
            if (timeDifference < 5) return;
            if (!canSync()) return;
            audioRef.current.currentTime = data.hostTime;
        }
    }, [currentTime, data, canSync, updateCurrentTime, dispatch]);


    const handleEnded = useCallback(() => {
        if (canInteract() && data.isHost) {
            nextSong({
                variables: {
                    roomId: normalizeId(data.id)
                }
            });
        }
        setTimeout(() => {
            if (data.currentSong === null) {
                log('Player', LOGGER_COLORS.Red, 'Curr song error.');
            }
        }, 100)
    }, [data, nextSong, canInteract]);

    useEffect(() => {
        const player = audioRef.current;
        if (!player) return;

        player.addEventListener('timeupdate', handleTimeUpdate);
        player.addEventListener('ended', handleEnded);

        return () => {
            player.removeEventListener('timeupdate', handleTimeUpdate);
            player.removeEventListener('ended', handleEnded);
        };
    }, [handleEnded, handleTimeUpdate]);

    useEffect(() => {
        if (!data.currentSong) return;
        setAudioUrl("");

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.volume = 0.0;
            audioRef.current = new Audio(undefined);
            log('Player', LOGGER_COLORS.Red, 'old');
        }


        log('Player', LOGGER_COLORS.Purple, `Killed player.`);
        const songId = data.currentSong.id;
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }

        log('Player', LOGGER_COLORS.Purple, `Set new song URL (${ songId })`);
        setAudioUrl(getAudioUrl(songId));
    }, [data.currentSong]);


    useEffect(() => {
        if (audioUrl.length === 0) return;

        if (audioRef.current){
            audioRef.current.pause();
            audioRef.current.volume = 0;
            audioRef.current.currentTime = 0;
        }

        audioRef.current = new Audio(audioUrl);

        log('Player', LOGGER_COLORS.Purple, `Updated audio ref.`);
        log('Player', LOGGER_COLORS.Purple, `Using song url: ${ audioUrl }`);
        audioRef.current.play();
    }, [audioUrl]);

    useEffect(() => {
        if (!audioRef.current) return;
        log('Player', LOGGER_COLORS.Purple, 'Hooking...')
        audioRef.current.currentTime = 0.0;

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                if(!audioRef.current) return;
                audioRef.current.currentTime = 0.0;
                audioRef.current.play()
                    .catch(e => console.error('Play event was cancelled', e))
            }, 150 * i);
        }
        log('Player', LOGGER_COLORS.Purple, `Trying change the status to PLAY`);
        let attempts = 0;

        const hook = () => {
            attempts++;

            if (attempts === 6) {
                log('Player', LOGGER_COLORS.Red, '[ERROR] Out of attempts. Failure.');
                return;
            }

            try {
                audioRef.current?.play()
                    .catch(e => {
                        log('Player', LOGGER_COLORS.Red, '[ERROR] Can`t change state to PLAY, retrying...');
                        console.error(e);
                        audioRef.current?.pause();
                        setTimeout(() => hook(), 800);
                    })
            } catch (e) {
                log('Player', LOGGER_COLORS.Red, '[ERROR] Can`t change state to PLAY, retrying...');
                console.error(e);
                audioRef.current?.pause();
                setTimeout(() => hook(), 800);
            }
        }
        hook();
    }, [audioUrl]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    },[volume]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPaused) audioRef.current.pause();
        else audioRef.current.play();
    }, [isPaused]);


    useEffect(() => {
        if (!audioRef.current || data.isHost) return;
        const changeDifference = Math.abs(Date.now() - lastChange) / 1000;
        if (changeDifference < 3) {
            log("Player", LOGGER_COLORS.Purple, 'Un-sync due song change');
            return;
        }
        const timeDifference = Math.abs(audioRef.current.currentTime - data.hostTime);
        if (timeDifference < 3) return;
        audioRef.current.currentTime = data.hostTime;
        log('Player', LOGGER_COLORS.Purple, `Синхронизировались с хостом.`);
    },[audioRef, data.hostTime, lastChange]);

    return {
        audioRef,
    }
}