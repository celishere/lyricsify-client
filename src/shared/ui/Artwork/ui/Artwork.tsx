import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

import Hls from "hls.js";

import classNames from "classnames";

import { getRoom } from "lyricsify/entities/Room/model/selectors/getRoom";
import { extractArtworkMetadata, isFallback } from "lyricsify/entities/Room/utils";

import cls from "./Artwork.module.scss";

interface ArtworkProps {
    mobile?: boolean;
    full?: boolean;
}

export const Artwork = ({ mobile, full }: ArtworkProps) => {
    const { data } = useSelector(getRoom);
    const fallback = isFallback(data);
    const { url, video } = extractArtworkMetadata(data);
    const playerRef = useRef<HTMLVideoElement | null>(null);
    const imageSize = mobile ? 120 : 1080;

    useEffect(() => {
        const player = playerRef.current;
        if (!player || !video) return;
        const browserHasNativeHLSSupport = player.canPlayType('application/vnd.apple.mpegurl');
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(video);
            hls.attachMedia(player);
        } else if (browserHasNativeHLSSupport) {
            player.src = video;
        }
        return () => {
            if (Hls.isSupported()){
                const hls = new Hls();
                hls.destroy();
            }
        };
    }, [video]);

    return (
        <div
            className={classNames(cls.svelte, {
                [cls.svelteMobile]: mobile,
                [cls.svelteFull]: full,
            })}
        >
            {
                !fallback && (
                    <div className={cls.artworkRadiosityContainer}>
                        <div className={cls.artworkRadiositySvelte}>
                            <Image
                                width={80}
                                height={80}
                                src={url}
                                alt="Song shadow artwork"
                                draggable={false}
                            />
                        </div>
                    </div>
                )
            }

            <div
                className={classNames(cls.pictureFrame, {
                    [cls.pictureFrameMobile]: mobile,
                    [cls.pictureFrameHidden]: (video && !mobile),
                    [cls.pictureFrameFull]: full
                })}
            >
                {
                    !fallback && (
                        <Image
                            width={imageSize}
                            height={imageSize}
                            src={url}
                            alt="Song artwork"
                            draggable={false}
                        />
                    )
                }
            </div>
            {
                video && !mobile && (
                    <div className={cls.videoFrame}>
                        <video
                            ref={playerRef}
                            width={1080}
                            height={1080}
                            playsInline
                            loop
                            autoPlay
                            muted
                            disableRemotePlayback
                            controls={false}
                            draggable={false}
                        />
                    </div>
                )
            }
        </div>
    );
};