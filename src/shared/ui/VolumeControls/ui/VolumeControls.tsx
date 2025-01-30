import React, {
    ChangeEvent,
    MouseEvent,
    useState,
    useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

import { getPlayer } from "lyricsify/entities/Player/model/selectors/getPlayer";
import { playerActions } from "lyricsify/entities/Player/model/slices/playerSlice";
import { VolumeIcon } from "lyricsify/shared/ui/Icons/VolumeIcon";

import cls from "./VolumeControls.module.scss";

interface VolumeControlsProps {
    mobile?: boolean;
    full?: boolean;
}

export const VolumeControls = ({ mobile, full }: VolumeControlsProps) => {
    const { volume } = useSelector(getPlayer);
    const [prevVolume, setPrevVolume] = useState(volume);
    const dispatch = useDispatch();

    const setVolume = useCallback((value: number) => {
        dispatch(playerActions.setVolume(value));
        localStorage.setItem('client:volume', String(value));
    }, [dispatch]);

    const toggleMute = useCallback(() => {
        setPrevVolume(volume);
        setVolume(volume > 0 ? 0 : prevVolume);
    }, [volume, prevVolume, setVolume]);


    const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.target.style.height = '8px';
    }, []);

    const handleMouseUp = useCallback((e: MouseEvent<HTMLInputElement>) => {
        if (e.target instanceof HTMLInputElement) {
            e.target.style.height = '4px';
        }
    }, []);

    const handleVolumeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setVolume(parseInt(e.target.value, 10) / 100)
    }, [setVolume])

    return (
        <div className={classNames(mobile && cls.mobileContainer, full && cls.fullContainer)}>
            <div className={classNames(cls.container, cls.volumeContainer, full && cls.fullContainer)}>
                <button
                    className={cls.volumeBtn}
                    onClick={toggleMute}
                >
                    <VolumeIcon volume={volume} />
                </button>
                <input
                    className={cls.progress}
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    onChange={handleVolumeChange}
                    onInput={handleInput}
                    onMouseUp={handleMouseUp}
                    dir="ltr"
                    role="slider"
                    aria-orientation="horizontal"
                    style={{ backgroundSize: `${volume * 100}% 100%` }}
                />
            </div>
        </div>
    );
};