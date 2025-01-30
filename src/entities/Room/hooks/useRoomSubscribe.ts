import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePostHog } from "posthog-js/react";
import { Centrifuge } from "centrifuge";
import { useLazyQuery } from "@apollo/client";

import { useToast } from "lyricsify/shared/lib/hooks/useToast";

import { getRoom } from "../model/selectors/getRoom";
import { roomActions } from "../model/slices/roomSlice";
import { playerActions } from "../../Player/model/slices/playerSlice";
import { buildChannel, normalizeId } from "../utils";
import { log, LOGGER_COLORS } from "lyricsify/shared/const/logger";
import { PlaybackState } from "lyricsify/shared/api/graphql/generated/graphql";

import GENERATE_CONNECTION_TOKEN from "../api/gql/generateConnectionToken.query";
import GENERATE_CHANNEL_TOKEN from "../api/gql/generateChannelToken.query";


type SubscriptionConfig = {
    channel: string;
    onPublication: (ctx: any) => void;
}

export const useRoomSubscribe = () => {
    const dispatch = useDispatch();
    const { data: room } = useSelector(getRoom);
    const posthog = usePostHog();
    const toasts = useToast();
    const [connection] = useLazyQuery(GENERATE_CONNECTION_TOKEN);
    const [channel] = useLazyQuery(GENERATE_CHANNEL_TOKEN);

    const handleCentrifugeError = useCallback((error: any) => {
        console.error("Centrifuge error", error);
        posthog.capture('centrifuge_error', {error: error.message});
        toasts.base({message: 'Connection error, please refresh page'});
    }, [toasts, posthog]);

    const handleGetToken = useCallback(async () => {
            return await connection().then(res => res?.data?.generateConnectionToken ?? "")
        }, [connection]
    );

    const handleGetChannelToken = useCallback(async (channelId: string) => {
            return await channel({ variables: { channelId }})
                .then(res => res?.data?.generateChannelToken ?? "")
        }, [channel]
    );

    const createSubscription = useCallback(async ({ channel, onPublication }: SubscriptionConfig, centrifuge: Centrifuge ) => {
        try {
            centrifuge.newSubscription(channel, {
                getToken: async () => await handleGetChannelToken(channel)
            }).on('publication', onPublication).subscribe();
        } catch (error){
            handleCentrifugeError(error);
        }

    }, [handleGetChannelToken, handleCentrifugeError]);

    const handleSetQueue = useCallback( (ctx: any, id: string) => {
        dispatch(roomActions.setQueue(ctx.data.payload.setQueue));

        posthog.capture('set_queue', {
            room: id,
            queue: ctx.data.payload.setQueue,
        });
    }, [dispatch, posthog]);

    const handleSetSong = useCallback((ctx: any, id: string, data: any) => {
        const response = ctx.data.payload;

        if (!response.setSong || data.currentSong?.id === response.setSong.song?.id) {
            return;
        }

        dispatch(playerActions.setChange(Date.now()));
        dispatch(roomActions.setSong(response.setSong.song));
        dispatch(roomActions.setHostTime(0.0));
        dispatch(roomActions.setPlayback(PlaybackState.Pause));
        dispatch(playerActions.setPlayback(true));
        dispatch(playerActions.setTime(0.0));

        posthog.capture('set_song', {
            room: id,
            song: response.setSong.song
        });
    }, [dispatch, posthog]);

    const handleAlert = useCallback((ctx: any, toasts: any) => {
        const payload = ctx.data.payload.alert;

        toasts.base({
            message: payload.title,
            subtitle: payload.subtitle ?? undefined,
            icon: payload.icon ?? undefined
        });
    }, [toasts])

    const handleChangePlaybackState = useCallback((ctx: any, id:string, data: any) => {
        const resultInfo = ctx.data.payload;
        if (!resultInfo.changePlaybackState) return;
        const value = resultInfo.changePlaybackState.state === PlaybackState.Pause ? 0 : 1;

        log('Subscribe', LOGGER_COLORS.Purple, `Room playback: ${ JSON.stringify(resultInfo.changePlaybackState) }`)

        if (data.isHost && resultInfo.changePlaybackState.noHost) return;

        dispatch(roomActions.setPlayback(resultInfo.changePlaybackState.state));
        dispatch(playerActions.setPlayback(value));
    }, [dispatch])

    const handleUpdateTime = useCallback((ctx: any, id: string) => {
        const payload = ctx.data.payload;
        if (!payload?.updateCurrentTime) return;

        dispatch(roomActions.setHostTime(payload.updateCurrentTime));
    }, [dispatch]);

    useEffect(() => {
        if(!room?.id) return;

        log('Websocket', LOGGER_COLORS.Pink, 'Subscribing... ' + normalizeId(room.id))
        const id = normalizeId(room.id);

        const SET_QUEUE = buildChannel("SET_QUEUE", id);
        const SET_SONG = buildChannel("SET_SONG", id);
        const ALERTS = buildChannel("ALERTS", id);
        const CHANGE_PLAYBACK_STATE = buildChannel("CHANGE_PLAYBACK_STATE", id);
        const UPDATE_CURRENT_TIME = `UPDATE_CURRENT_TIME_${id}`

        const centrifuge = new Centrifuge(process.env.CENTRIFUGE_WS_URL || "", {
            getToken:  handleGetToken,
            debug: process.env.NODE_ENV === 'development',
        });

        createSubscription({
            channel: SET_QUEUE,
            onPublication: (ctx) => handleSetQueue(ctx, id)
        }, centrifuge);

        createSubscription({
            channel: SET_SONG,
            onPublication: (ctx) => handleSetSong(ctx, id, room)
        }, centrifuge);

        createSubscription({
            channel: ALERTS,
            onPublication: (ctx) => handleAlert(ctx, toasts)
        }, centrifuge);

        createSubscription({
            channel: CHANGE_PLAYBACK_STATE,
            onPublication: (ctx) => handleChangePlaybackState(ctx, id, room)
        }, centrifuge);

        createSubscription({
            channel:  UPDATE_CURRENT_TIME,
            onPublication: (ctx) => handleUpdateTime(ctx, id)
        }, centrifuge);

        centrifuge.connect();

        return () => {
            centrifuge.disconnect();
        };
    }, [room, createSubscription, handleGetToken, handleSetQueue, handleSetSong, handleAlert, handleChangePlaybackState, handleUpdateTime]);
}