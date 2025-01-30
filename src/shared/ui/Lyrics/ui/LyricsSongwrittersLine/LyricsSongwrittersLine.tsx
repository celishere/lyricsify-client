import { forwardRef } from "react";

import { ILyricsLine } from "../../interfaces/LyricsProps.interface";

import cls from "./LyricsSongwrittersLine.module.scss";

interface LyricsSongwrittersLineProps {
    line: ILyricsLine;
    currentLine: number | null;
}

export const LyricsSongwrittersLine = forwardRef<HTMLDivElement, LyricsSongwrittersLineProps>(
    ({ line, currentLine }, ref) => {
        const isCurrent = currentLine === line.id;

        return (
            <div
                ref={ref}
                className={cls.authorsBox}
                data-current={isCurrent}
            >
                <span className={cls.footerLabel}>Автор(ы):</span>
                <span className={cls.footerText}>{line.content}</span>
            </div>
        );
    }
);