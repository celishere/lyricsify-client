import {useSelector} from "react-redux";

import classNames from "classnames";

import {usePlayer} from "lyricsify/shared/lib/hooks/usePlayer";

import {getRoom} from "lyricsify/entities/Room/model/selectors/getRoom";
import {useCanvas} from "lyricsify/shared/lib/hooks/useCanvas";

import {isFallback} from "lyricsify/entities/Room/utils";

import {Artwork} from "lyricsify/shared/ui/Artwork";
import {Metadata} from "lyricsify/shared/ui/Metadata";
import {Controls} from "lyricsify/shared/ui/Controls";

import {VolumeControls} from "lyricsify/shared/ui/VolumeControls";
import {ProgressBar} from "lyricsify/shared/ui/ProgressBar";
import {Lyrics} from "lyricsify/shared/ui/Lyrics/ui/Lyrics";

import cls from "./RoomLayoutContent.module.scss";

export const RoomLayoutContent = () => {
    const { audioRef } = usePlayer();
    const { data } = useSelector(getRoom);
    const canvasRef = useCanvas();

    const fallback = isFallback(data);

    return (
        <>
            <div className={cls.canvas}>
                <canvas
                    ref={canvasRef}
                    id="svelte-canvas"
                />
            </div>
            {
                data.fullscreen ? (
                    <>
                        <div className={cls.leftMinified}>
                            <Artwork mobile full/>
                            <Metadata full ref={audioRef.current}/>
                        </div>
                        <div className={classNames(cls.controlsBox, !data.toolbarActive && cls.fadeOut)}>
                            <Controls ref={audioRef.current}/>
                            <div className={cls.controlsBoxVol}>
                                <VolumeControls full/>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={classNames(
                        cls.container,
                        (fallback || !data.lyricsEnabled) && cls.containerSingle,
                        data.lyricsEmpty && cls.containerMinified
                    )}
                    >
                        <div className={classNames(cls.left, (fallback || !data.lyricsEnabled) && cls.leftSingle)}>
                            <Artwork/>
                            {!fallback && (
                                <>
                                    <ProgressBar audioRef={audioRef.current}/>
                                </>
                            )}
                            <Metadata ref={audioRef.current}/>
                        </div>
                        {data.lyricsEnabled && !fallback && (
                            <div className={cls.right}>
                                <Lyrics audioRef={audioRef.current}/>
                            </div>
                        )}
                    </div>
                )
            }
        </>
    )
}