import { ILyricsLine, LyricsMetadata } from "../interfaces/LyricsProps.interface";

export const buildLines = (metadata: LyricsMetadata): ILyricsLine[] => {
    const lines: ILyricsLine[] = [];
    let lastTime = 0;
    let index = 0;

    for (const verse of metadata.verses) {
        for (const line of verse.lines) {
            const begin = line.begin;
            const diff = begin - lastTime;

            if (begin > lastTime && diff / 1000 > 5) {
                lines.push({
                    id: index,
                    agent: "",
                    begin: lastTime,
                    end: begin,
                    bg: [],
                    key: "",
                    partType: "start",
                    words: [],
                    content: ""
                });
                index++;
            }

            if (line.words.length > 0 && line.words[0].end === 0) {
                line.words[0].begin = line.begin;
                line.words[0].end = line.words[1].begin;
            }

            line.id = index;

            lastTime = line.end;
            index++;
            lines.push(line);
        }
    }

    if (metadata.songwriters.length > 0) {
        lines.push({
            id: index,
            agent: "",
            begin: lastTime,
            end: metadata.dur,
            bg: [],
            key: "",
            partType: "songwritters",
            words: [],
            content: metadata.songwriters.join(', ')
        });
    }
    return lines;
};

interface ValuesProps {
    opacity: number;
    matrix: number;
    radius: number;
}

export const calcValues = (value: number, isBg: boolean): ValuesProps => {
    const matrixBase = isBg ? -0.5 : -2;
    const opacity = value < 100 ? 0.85 / 120 : 0;
    const matrix = matrixBase * ((value + 20) / 120);
    const radius = value <= 70 ? (value / 70) * 9 : 9 - ((value - 70) / 30) * 5;

    return {
        opacity,
        matrix,
        radius,
    };
};

export const styleLine = (
    gradient: number,
    radius: number,
    opacity: number,
    matrix: number
): string => {
    return `--gradient-progress: ${gradient}%;
            --text-shadow-blur-radius: ${radius}px;
            --text-shadow-opacity: ${opacity};
            transform: matrix(1, 0, 0, 1, 0, ${matrix});
            text-shadow: 0 0 var(--text-shadow-blur-radius) rgba(255, 255, 255, var(--text-shadow-opacity));
    `;
};