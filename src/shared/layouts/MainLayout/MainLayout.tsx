import React, { useEffect, useRef } from "react";

import { useRouter } from "next/router";

import { useLazyQuery } from "@apollo/client";

import { LyricsScene } from "lyricsify/shared/scripts/shader";
import { HOME_ARTWORK_URL } from "lyricsify/shared/const/values";

import CREATE_ROOM from "lyricsify/entities/Room/api/gql/create-room.model";

import cls from "./MainLayout.module.scss";

export const MainLayout = () => {
    const [createRoomRequest] = useLazyQuery(CREATE_ROOM);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();

    const createRoom = () => createRoomRequest()
        .then(result => router.push(`/${result.data?.createRoom}`));

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new LyricsScene(canvasRef.current, HOME_ARTWORK_URL);

        scene?.initAnimation();
        scene?.updateArtwork(HOME_ARTWORK_URL);

        return () => {
            scene?.destroy();
        }
    }, []);

    return (
        <>
            <div className={ cls.canvas }>
                <canvas ref={ canvasRef } id="svelte-canvas"/>
            </div>

            <div className={ cls.container }>
                <a className={ cls.title }>Lyricsify</a>

                <div
                    className={ cls.button }
                    onClick={ createRoom }
                >
                    <a>Создать комнату</a>
                </div>
            </div>
        </>
    )
}