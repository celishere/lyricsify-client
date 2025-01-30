import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLazyQuery, useMutation } from "@apollo/client";
import classNames from "classnames";
import Image from "next/image";

import FETCH_SONG from "lyricsify/entities/Room/api/gql/fetch-song.model";
import ADD_SONG from "lyricsify/entities/Room/api/gql/mutations/add-song.mutation";
import REMOVE_SONG from "lyricsify/entities/Room/api/gql/mutations/remove-song.mutation";
import { getRoom } from "lyricsify/entities/Room/model/selectors/getRoom";
import { normalizeId } from "lyricsify/entities/Room/utils";
import { getSongs } from "lyricsify/entities/Song/model/selectors/getSongs";
import { LoaderIcon } from "lyricsify/shared/ui/Icons/LoaderIcon";
import { SuccessIcon } from "lyricsify/shared/ui/Icons/SuccessIcon";
import { AddIconV2 } from "lyricsify/shared/ui/Icons/AddIconV2";
import { DeleteIcon } from "lyricsify/shared/ui/Icons/DeleteIcon";

import cls from "./SongCard.module.scss";

interface CardProps {
    id: string;
    artwork: string;
    title: string;
    artist: string;
    album: string;
    adding?: boolean;
    queueId?: string;
}

export const SongCard = ({
                             id,
                             artwork,
                             title,
                             artist,
                             album,
                             adding,
                             queueId,
                         }: CardProps) => {
    const [added, setAdded] = useState(false);
    const [loading, setLoading] = useState(false);
    const { data } = useSelector(getRoom);
    const { cacheQueue } = useSelector(getSongs);
    const [fetchSong] = useLazyQuery(FETCH_SONG);
    const [addSong] = useMutation(ADD_SONG);
    const [removeSong] = useMutation(REMOVE_SONG);

    const handleAdd = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        try {
            if (adding) {
                const fetchResponse = await fetchSong({ variables: { songId: id } });
                if (!fetchResponse.data) return;
                await addSong({ variables: { roomId: normalizeId(data.id), songId: id } });
            } else {
                await removeSong({ variables: { roomId: normalizeId(data.id), queueId: queueId ?? "" } });
            }
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } finally {
            setLoading(false);
        }
    }, [
        loading,
        adding,
        id,
        fetchSong,
        addSong,
        removeSong,
        data.id,
        queueId
    ]);


    const getStatus = useCallback(() => {
        return loading ? <LoaderIcon /> : (adding ? <AddIconV2 /> : <DeleteIcon />);
    }, [loading, adding]);


    return (
        <>
            <div key={`card-${id}`} className={cls.card}>
                <div className={cls.cardBody}>
                    <div className={cls.imageBody}>
                        <Image width={100} height={100} src={artwork} alt="Artwork" />
                    </div>
                    <div className={cls.props}>
                        <a>{artist} - {title}</a>
                        <span>{album}</span>
                    </div>
                </div>
                <div className={cls.gap}>
                    <div onClick={handleAdd} className={classNames(cls.addButton)}>
                        {!added ? getStatus() : <SuccessIcon />}
                    </div>
                </div>
            </div>
            {!adding && cacheQueue[id] > 0 && (
                <div className={cls.progress}>
                    <div className={cls.progressBarBox}>
                        <div
                            style={{ width: `${cacheQueue[id]}%` }}
                            className={cls.progressBar}
                        />
                    </div>
                    <a className={cls.downloadProgress}>
                        {Math.floor(cacheQueue[id])}%
                    </a>
                </div>
            )}
        </>
    );
};