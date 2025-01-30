import React, { forwardRef, useCallback } from "react";
import classNames from "classnames";
import { ILyricsLine } from "../../interfaces/LyricsProps.interface";
import cls from "./LyricsLine.module.scss";

interface LyricsLineProps {
    line: ILyricsLine;
    isScrolling: boolean;
    currentLine: number | null;
    changeLine: (id: number, force?: boolean) => void;
}

export const LyricsLine = forwardRef<HTMLDivElement, LyricsLineProps>(({
                                                                           line,
                                                                           isScrolling,
                                                                           currentLine,
                                                                           changeLine
                                                                       }, ref) => {
    const isCurrent = currentLine === line.id;
    const isHidden = currentLine !== null && currentLine > line.id && !isScrolling;

    const handleClick = useCallback(() => {
        changeLine(line.id, true);
    }, [changeLine, line.id])

    return (
        <div
            ref={ref}
            className={classNames(cls.lineBlock, { [cls.hiddenLine]: isHidden })}
            data-current={String(isCurrent)}
            onClick={handleClick}
            data-content={line.content}
        >
            <a
                className={classNames(cls.line, {
                    [cls.lineAgent]: line.agent !== "v1",
                })}
            >
                {line.content}
            </a>
        </div>
    );
});