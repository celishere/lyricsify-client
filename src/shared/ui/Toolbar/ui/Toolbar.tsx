import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import classNames from "classnames";

import { log, LOGGER_COLORS } from "lyricsify/shared/const/logger";
import { getRoom } from "lyricsify/entities/Room/model/selectors/getRoom";
import { roomActions } from "lyricsify/entities/Room/model/slices/roomSlice";
import { Modal, QRModal, SearchSongModal } from "lyricsify/shared/ui/Modal";
import { Queue } from "lyricsify/shared/ui/Queue";

import { QRCodeIcon } from "lyricsify/shared/ui/Icons/QRCodeIcon";
import { AddIcon } from "lyricsify/shared/ui/Icons/AddIcon";
import { FullScreenIcon } from "lyricsify/shared/ui/Icons/FullScreenIcon";

import { songsActions } from "lyricsify/entities/Song/model/slices/songsSlice";
import { getSongs } from "lyricsify/entities/Song/model/selectors/getSongs";
import { downloadSong, getAudioUrl } from "lyricsify/entities/Room/utils";

import cls from "./Toolbar.module.scss";

interface ToolBarProps {
    mobile?: boolean;
}

export const Toolbar = ({ mobile }: ToolBarProps) => {
    const [search, setSearch] = useState(false);
    const [queue, setQueue] = useState(false);
    const [qr, setQR] = useState(false);
    const mouseMovedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dispatch = useDispatch();
    const { data } = useSelector(getRoom);
    const { blobCache, cacheQueue } = useSelector(getSongs);

    const handleMouseMove = useCallback(() => {
        if (mouseMovedTimeout.current) {
            clearTimeout(mouseMovedTimeout.current);
            dispatch(roomActions.changeToolbarState(true));
        }
        mouseMovedTimeout.current = setTimeout(() => {
            dispatch(roomActions.changeToolbarState(false));
        }, 1500);
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleMouseMove]);

    const toggleSearch = useCallback(() => setSearch(false), []);
    const toggleQR = useCallback(() => setQR(false), []);
    const toggleQueue = useCallback(() => setQueue(false), []);
    const toggleFullScreen = useCallback(() =>
            dispatch(roomActions.changeFullScreenState(!data.fullscreen)),
        [dispatch, data.fullscreen]
    );

    useEffect(() => {
        data.queue.forEach(item => {
            if (blobCache[item.id] && !cacheQueue[item.id]) {
                dispatch(songsActions.setBlobProgress({
                    id: item.id,
                    progress: 100
                }));

                log('Queue', LOGGER_COLORS.Pink,
                    `Песня с ID ${ item.id } уже была скачана но blobCache не знал об полной загрузке.`
                );
                return;
            }

            downloadSong(
                item.id,
                getAudioUrl(item.id),
                (percentage) => {
                    dispatch(songsActions.setBlobProgress({
                        id: item.id,
                        progress: percentage
                    }));
                }
            ).then(url => {
                dispatch(songsActions.setBlobProgress({
                    id: item.id,
                    progress: 100
                }));

                dispatch(songsActions.addBlob({
                    id: item.id,
                    url
                }));

                log('Queue', LOGGER_COLORS.Pink,
                    `Blob песни с ID ${ item.id } был сохранен в сторе.`
                );
            });
        })
    }, [data.queue, blobCache, cacheQueue, dispatch]);

    return (
        <>
            {search && (
                <Modal handleCloseModal={toggleSearch}>
                    <SearchSongModal />
                </Modal>
            )}
            {qr && (
                <Modal handleCloseModal={toggleQR}>
                    <QRModal />
                </Modal>
            )}
            {queue && <Queue close={toggleQueue} mobile={mobile} />}
            <div
                className={classNames(
                    cls.container,
                    mobile && cls.containerMobile,
                    !data.toolbarActive && cls.fadeOut
                )}
            >
                {!mobile && (
                    <button
                        className={classNames(cls.bubble, cls.bubbleQr, mobile && cls.bubbleMobile)}
                        onClick={toggleFullScreen}
                    >
                        <FullScreenIcon />
                    </button>
                )}
                {!mobile && (
                    <button
                        className={classNames(cls.bubble, cls.bubbleQr, mobile && cls.bubbleMobile)}
                        onClick={() => setQR(true)}
                    >
                        <QRCodeIcon />
                    </button>
                )}
                <button
                    className={classNames(cls.bubble, mobile && cls.bubbleMobile)}
                    onClick={() => setSearch(true)}
                >
                    <AddIcon />
                    {!mobile && <a>добавить песню</a>}
                </button>
                <button
                    className={cls.bubble}
                    onClick={() => setQueue(true)}
                >
                    <a>очередь ({data.queue.length})</a>
                </button>
                <div className={classNames(cls.empty, mobile && cls.emptyMobile)} />
            </div>
        </>
    );
};