import React, { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Mousetrap from "mousetrap";
import classNames from "classnames";

import { CloseIcon } from "lyricsify/shared/ui/Icons/CloseIcon";
import { getRoom } from "lyricsify/entities/Room/model/selectors/getRoom";
import { SongCard } from "lyricsify/shared/ui/SongCard";
import { useOutsideClick } from "lyricsify/shared/lib/hooks/useOutsideClick";

import cls from "./Queue.module.scss";

interface QueueProps {
    close: () => void;
    mobile?: boolean;
}

export const Queue = ({ close, mobile }: QueueProps) => {
    const { data } = useSelector(getRoom);

    const handleEscClose = useCallback(() => close(), [close]);
    const queueRef = useOutsideClick(close);

    useEffect(() => {
        Mousetrap.bind('esc', handleEscClose);

        return () => {
            Mousetrap.unbind('esc');
        };
    }, [handleEscClose]);

    return (
        <div className={cls.container}>
            <div
                ref={queueRef}
                className={classNames(cls.block, mobile && cls.mobileBlock)}
            >
                <div className={cls.header}>
                    <div>
                        <a>Очередь</a>
                        <button
                            data-slot="close"
                            onClick={close}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>
                <div className={cls.itemsBlock}>
                    <div className={cls.items}>
                        {data.queue.length > 0 ? (
                            <>
                                {data.queue.map((song) => (
                                    <SongCard
                                        key={song.queueId}
                                        id={song.id}
                                        artwork={song.attributes.artwork.url}
                                        title={song.attributes.name}
                                        artist={song.attributes.artistName}
                                        album={song.attributes.albumName}
                                        queueId={song.queueId}
                                    />
                                ))}
                            </>
                        ) : (
                            <div className={cls.emptyQueue}>
                                <a>Очередь пуста.</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};