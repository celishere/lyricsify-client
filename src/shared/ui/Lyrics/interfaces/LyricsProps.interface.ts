export interface LyricsMetadata {
    dur: number;
    lang: string;
    timing: string;
    songwriters: string[];
    verses: LyricsVerse[];
}

export interface LyricsVerse {
    begin: number;
    end: number;
    partType: string;
    lines: ILyricsLine[];
}

export interface ILyricsLine {
    id: number;
    agent: string;
    begin: number;
    end: number;
    bg: LyricsWord[];
    key: string;
    partType: 'start' | 'songwritters' | '';
    words: LyricsWord[];
    content: string;
}

export interface LyricsWord {
    begin: number;
    end: number;
    content: string;
    hasTrailingWhitespace: boolean;
    partType: string;
}

export interface LineRefBody {
    lineId: number;
    maxId: string;
    id: string;
    item: HTMLSpanElement;
    duration: number;
    delay: number;
    clearDelay: number;
    isBackground: boolean;
}