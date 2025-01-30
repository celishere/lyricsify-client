import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";

import { LyricsScene } from "lyricsify/shared/scripts/shader";
import { getRoom } from "lyricsify/entities/Room/model/selectors/getRoom";
import { getArtwork } from "lyricsify/entities/Room/utils";

export const useCanvas = () => {
    const { data } = useSelector(getRoom);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scene, setScene] = useState<LyricsScene | null>(null);
    const updateScene = useCallback(() => {
        if (!canvasRef.current) return;

        const artwork = getArtwork(data);
        if (!scene) {
            setScene(new LyricsScene(canvasRef.current, artwork));
        } else {
            scene.updateArtwork(artwork)
        }
    }, [data, scene]);


    useEffect(() => {
        if(!canvasRef.current) return;
        setScene(new LyricsScene(canvasRef.current, getArtwork(data)));
        return () => {
            scene?.destroy();
        }
    }, []);


    useEffect(() => {
        updateScene();
    }, [data.currentSong, updateScene]);

    return canvasRef;
};