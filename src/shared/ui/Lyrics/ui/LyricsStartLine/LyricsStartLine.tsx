import classNames from "classnames";

import { ILyricsLine } from "../../interfaces/LyricsProps.interface";

import cls from "./LyricsStartLine.module.scss";

interface LyricsLineProps {
    line: ILyricsLine;
    currentLine: number | null;
    currentTime: number;
}

export const LyricsStartLine = ({
                                    line,
                                    currentLine,
                                    currentTime
                                }: LyricsLineProps) => {
    const begin = line.begin / 1000;
    const end = line.end / 1000;

    const diff = end - begin;

    const first = begin;
    const second = (diff / 3) + begin;
    const third = (diff / 3 * 2) + begin;

    const isCurrent = currentLine === line.id;

    return (
        <div
            className={cls.waitBlock}
            data-id={line.id}
            data-current={isCurrent}
            data-start={line.begin}
            data-end={line.end}
        >
             <span
                 style={{transitionDuration: `${diff * 1000 / 3}ms`}}
                 className={classNames(cls.dot, { [cls.dotCurrent]: currentTime > first })}
             />
            <span
                style={{transitionDuration: `${diff * 1000 / 3}ms`}}
                className={classNames(cls.dot, { [cls.dotCurrent]: currentTime > second })}
            />
            <span
                style={{transitionDuration: `${diff * 1000 / 3}ms`}}
                className={classNames(cls.dot, { [cls.dotCurrent]: currentTime > third })}
            />
        </div>
    );
};