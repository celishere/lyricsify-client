import React, {
    ChangeEvent,
    useEffect,
    useState,
    MouseEvent,
    useCallback
} from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

import { getPlayer } from "lyricsify/entities/Player/model/selectors/getPlayer";
import { getRoom } from "lyricsify/entities/Room/model/selectors/getRoom";
import { extractDuration } from "lyricsify/entities/Room/utils";
import { convertSecondsToMinSec } from "lyricsify/shared/lib/utils";
import { playerActions } from "lyricsify/entities/Player/model/slices/playerSlice";

import cls from "./ProgressBar.module.scss";

interface ProgressBarProps {
    audioRef: HTMLAudioElement;
    mobile?: boolean;
}

export const ProgressBar = ({ audioRef, mobile }: ProgressBarProps) => {
    const { currentTime } = useSelector(getPlayer);
    const { data } = useSelector(getRoom);
    const dispatch = useDispatch();
    const duration = extractDuration(data);

    const [progress, setProgress] = useState(0);
    const [active, setActive] = useState(false);

    useEffect(() => {
        setProgress((currentTime / duration) * 100);
    }, [currentTime, duration]);

    const setTime = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const time = parseInt(e.target.value, 10);
        audioRef.currentTime = time;
        dispatch(playerActions.setTime(time));
    }, [audioRef, dispatch]);

    const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.target.style.height = '6px';
        setActive(true);
    }, []);

    const handleMouseUp = useCallback((e: MouseEvent<HTMLInputElement>) => {
        if (e.target instanceof HTMLInputElement) {
            e.target.style.height = '4px';
        }
        setActive(false);
    }, []);

    return (
        <div className={classNames(mobile && cls.mobileContainer)}>
            <div className={cls.container}>
                <div className={cls.timeContainer}>
                    <time className={cls.time}>
                        {convertSecondsToMinSec(currentTime)}
                    </time>
                    <time className={cls.time}>
                        -{convertSecondsToMinSec(duration - currentTime)}
                    </time>
                </div>
                <div className={cls.progressContainer}>
                    <input
                        data-active={active}
                        className={cls.progress}
                        type="range"
                        min="0"
                        max={String(duration)}
                        value={currentTime}
                        onChange={setTime}
                        dir="ltr"
                        role="slider"
                        aria-orientation="horizontal"
                        style={{ backgroundSize: `${progress}% 100%` }}
                        onInput={handleInput}
                        onMouseUp={handleMouseUp}
                    />
                </div>
            </div>
        </div>
    );
};