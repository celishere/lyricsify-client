import { useEffect } from "react";

import Head from "next/head";
import { useSelector } from "react-redux";

import { useRoomSubscribe } from "lyricsify/entities/Room/hooks/useRoomSubscribe";

import { Toolbar } from "lyricsify/shared/ui/Toolbar";

import { getRoom } from "lyricsify/entities/Room/model/selectors/getRoom";

import { ToggleLyrics } from "lyricsify/shared/ui/ToggleLyrics";

import { useSettings } from "lyricsify/shared/lib/hooks/useSettings";

import { RoomLayoutContent } from "./ui/RoomLayoutContent";

export const RoomLayout = () => {
    const { data } = useSelector(getRoom);
    const { getSettings } = useSettings();

    useRoomSubscribe();

    useEffect(() => {
        getSettings();
    }, []);

    const getTitle = () => {
        if (data?.currentSong?.attributes) {
            const attributes = data.currentSong.attributes;
            return `${ attributes.artistName } — ${ attributes.name } | Lyricsify`;
        }
        return `In room | Lyricsify`;
    }

    return (
        <>
            <Head>
                <title>{getTitle()}</title>
            </Head>
            <Toolbar/>
            <ToggleLyrics/>
            <RoomLayoutContent/>
        </>
    )
}