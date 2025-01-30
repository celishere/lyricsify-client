import {useCallback, useEffect, useReducer, useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAnimate } from "framer-motion";

import classNames from "classnames";

import { LineRefBody, ILyricsLine } from "../interfaces/LyricsProps.interface";

import { LyricsLine } from "./LyricsLine";

import { buildLines, calcValues, styleLine } from "lyricsify/shared/ui/Lyrics/utils/lyricsUtils";
import { buildLyrics } from "lyricsify/entities/Room/utils";

import { getRoom } from "lyricsify/entities/Room/model/selectors/getRoom";
import { roomActions } from "lyricsify/entities/Room/model/slices/roomSlice";

import { getPlayer } from "lyricsify/entities/Player/model/selectors/getPlayer";
import { playerActions } from "lyricsify/entities/Player/model/slices/playerSlice";

import { LyricsStartLine } from "lyricsify/shared/ui/Lyrics/ui/LyricsStartLine";
import { RichLyricsLine } from "lyricsify/shared/ui/Lyrics/ui/RichLyricsLine";

import {isSafari} from "lyricsify/shared/lib/utils";
import {LyricsSongwrittersLine} from "lyricsify/shared/ui/Lyrics/ui/LyricsSongwrittersLine";
import {useMutation} from "@apollo/client";
import UPDATE_CURRENT_TIME from "lyricsify/entities/Room/api/gql/mutations/update-current-time.mutation";

import cls from "./Lyrics.module.scss";
import richCls from "./RichLyricsLine/RichLyricsLine.module.scss";

interface LyricsProps {
    audioRef: HTMLAudioElement;
    mobile?: boolean;
}

type LyricsState = {
    lines: ILyricsLine[];
    activeLines: number[];
    currentLine: number | null;
    scriptScrolling: boolean;
    scrolling: boolean;
};

const initialState: LyricsState = {
    lines: [],
    activeLines: [],
    currentLine: null,
    scriptScrolling: false,
    scrolling: false,
};

function lyricsReducer(state: LyricsState, action: any) {
    switch (action.type) {
        case "SET_LINES":
            return { ...state, lines: action.payload };
        case "SET_ACTIVE_LINES":
            return { ...state, activeLines: action.payload };
        case "SET_CURRENT_LINE":
            return { ...state, currentLine: action.payload };
        case "SET_SCRIPT_SCROLLING":
            return { ...state, scriptScrolling: action.payload };
        case "SET_SCROLLING":
            return { ...state, scrolling: action.payload };
        default:
            return state;
    }
}

export const Lyrics = ({ audioRef, mobile }: LyricsProps) => {
    const [updateCurrentTime] = useMutation(UPDATE_CURRENT_TIME);
    const { data: roomData } = useSelector(getRoom);
    const { currentTime } = useSelector(getPlayer);
    const dispatch = useDispatch();
    const [state, dispatchState] = useReducer(lyricsReducer, initialState);
    const [linesRefs, setLinesRefs] = useState<LineRefBody[]>([]);
    const [currentLineStored, setCurrentLineStored] = useState(-1);

    const lyricsRef = useRef<HTMLDivElement>(null);
    const lyricsBoxRef = useRef<HTMLDivElement>(null);
    const [_scope, animate] = useAnimate();
    const scrollTimeout = useRef<NodeJS.Timeout>();

    const { lines, activeLines, currentLine, scriptScrolling, scrolling } = state;

    const handleLineAnimation = useCallback(async () => {
        const newActiveLines: number[] = [];

        for (const body of linesRefs) {
            if (!body?.item) continue;

            newActiveLines.push(body.lineId);

            await animate(-20, 100, {
                duration: body.duration / 1000,
                delay: body.delay / 1000 + 0.3,
                onUpdate: (value) => {
                    const { opacity, matrix, radius } = calcValues(value, body.isBackground);
                    body.item.style.cssText = styleLine(value, radius, opacity, matrix);
                },
                onComplete: () => {
                    if (body.id === body.maxId) {
                        dispatchState({ type: "SET_ACTIVE_LINES", payload: activeLines.filter((id: number) => id !== body.lineId) });
                    }
                    animateClearEffect(body);
                }
            });
        }

        // @ts-ignore
        dispatchState({ type: "SET_ACTIVE_LINES", payload: [...new Set(newActiveLines)] });
    }, [linesRefs, animate, activeLines]);

    const animateClearEffect = useCallback((body: LineRefBody) => {
        animate(100, -20, {
            duration: 0.4,
            delay: (body.clearDelay / 1000) + 0.4,
            onUpdate: (value) => {
                const { matrix } = calcValues(value, body.isBackground);
                const normalizedValue = (value + 20) / 120;
                const opacity = 0.6 + 0.4 * normalizedValue;

                body.item.style.cssText = `
          opacity: ${opacity};
          transform: matrix(1, 0, 0, 1, 0, ${matrix});
          --gradient-progress: 100%;
          text-shadow: 0 0 var(--text-shadow-blur-radius) rgba(255, 255, 255, var(--text-shadow-opacity));
        `;
            },
            onComplete: () => {
                body.item.style.cssText = `
          --gradient-progress: -20%;
          transform: matrix(1, 0, 0, 1, 0, 0);
        `;
                handleLineCompletion(body);
            }
        });
    }, [animate]);

    const handleLineCompletion = useCallback((body: LineRefBody) => {
        if (!currentLine || !body.item.parentElement) return;

        try {
            const parentElement = body.item.parentElement.parentElement?.parentElement;
            if (parentElement && currentLine > body.lineId) {
                parentElement.classList.add(richCls.hiddenLine);
            }
        } catch (e) {
            console.error("Error handling line completion:", e);
        }
    }, [currentLine]);

    const scrollToCurrentLine = useCallback((lineIndex: number, force = false) => {
        if (!lyricsRef.current?.children || !lyricsBoxRef.current) return;

        const targetLine = lyricsRef.current.children[lineIndex + 1] as HTMLElement;
        if (!targetLine) return;

        const offset = mobile
            ? targetLine.offsetTop - 100
            : targetLine.offsetTop - (roomData.fullscreen ? 51 : 240);

        if (scrolling && !force) return;

        lyricsBoxRef.current.scrollTo({ top: offset, behavior: "smooth" });
        dispatchState({ type: "SET_SCRIPT_SCROLLING", payload: true });

        setTimeout(() => {
            dispatchState({ type: "SET_SCRIPT_SCROLLING", payload: false });
        }, 500);
    }, [scrolling, roomData.fullscreen, mobile]);

    const changeLine = useCallback(async (id: number, force = false) => {
        if (!lines[id]) return;

        if (force) {
            const time = (lines[id].begin / 1000) - 0.3;

            try {
                await updateCurrentTime({
                    variables: { roomId: roomData.id ?? "", time }
                });

                audioRef.currentTime = time;
                dispatch(playerActions.setTime(time));

                setLinesRefs([]);
                dispatchState({ type: "SET_ACTIVE_LINES", payload: [] });
            } catch (error) {
                console.error("Error updating current time:", error);
            }
        }

        scrollToCurrentLine(id, force);
        dispatchState({ type: "SET_CURRENT_LINE", payload: id });
    }, [lines, roomData.id, audioRef, dispatch, scrollToCurrentLine, updateCurrentTime]);

    const resetLines = useCallback(() => {
        linesRefs.forEach(line => {
            if (line.item) line.item.style.cssText = "";
        });
        setLinesRefs([]);
    }, [linesRefs]);

    useEffect(() => {
        const loadLyrics = async () => {
            const lyrics = await buildLyrics(roomData);
            if (!lyrics) {
                dispatchState({ type: "SET_LINES", payload: [] });
                dispatch(roomActions.changeLyricsState(true));
                return;
            }

            dispatchState({ type: "SET_LINES", payload: buildLines(lyrics) });
            dispatch(roomActions.changeLyricsState(false));
        };

        loadLyrics();
    }, [roomData.currentSong, dispatch]);

    useEffect(() => {
        if (!lines.length) return;

        const hookedTime = currentTime + (mobile ? 0.4 : 0);
        let newLine: number | null = null;

        for (let i = 0; i < lines.length; i++) {
            const realBegin = lines[i].begin - 700;
            if (hookedTime >= (realBegin / 1000) && hookedTime <= (lines[i].end / 1000)) {
                newLine = i;
            }
        }

        if (newLine !== null && currentLine !== newLine) {
            changeLine(newLine);
        }
    }, [currentTime, lines, currentLine, changeLine, mobile]);

    useEffect(() => { handleLineAnimation(); }, [linesRefs]);
    useEffect(() => { scrollToCurrentLine(currentLine ?? 0); }, [roomData.fullscreen, roomData.lyricsEnabled]);

    useEffect(() => {
        if (isSafari()) return;

        const handleScroll = () => {
            if (scriptScrolling && scrolling) {
                dispatchState({ type: "SET_SCROLLING", payload: false });
            }

            if (!scriptScrolling) {
                dispatchState({ type: "SET_SCROLLING", payload: true });
                clearTimeout(scrollTimeout.current!);
                scrollTimeout.current = setTimeout(() => {
                    dispatchState({ type: "SET_SCROLLING", payload: false });
                    if (currentLine !== null) scrollToCurrentLine(currentLine);
                }, 5000);
            }
        };

        const element = lyricsBoxRef.current;
        element?.addEventListener("scroll", handleScroll);
        element?.addEventListener("scrollend", () => dispatchState({ type: "SET_SCROLLING", payload: false }));

        return () => {
            element?.removeEventListener("scroll", handleScroll);
            element?.removeEventListener("scrollend", () => dispatchState({ type: "SET_SCROLLING", payload: false }));
            clearTimeout(scrollTimeout.current!);
        };
    }, [scriptScrolling, currentLine, scrollToCurrentLine]);

    const renderLine = useCallback((line: ILyricsLine) => {
        const lineProps = {
            key: line.id,
            line,
            currentLine,
            isScrolling: scrolling,
            changeLine,
        };

        switch (line.partType) {
            case "start":
                return <LyricsStartLine {...lineProps} currentTime={currentTime} />;
            case "songwritters":
                return <LyricsSongwrittersLine {...lineProps} />;
            default:
                return line.words.length > 0 ? (
                    <RichLyricsLine
                        {...lineProps}
                        currentLineStored={currentLineStored}
                        setCurrentLineStored={setCurrentLineStored}
                        activeLines={activeLines}
                        resetLines={resetLines}
                        pushLine={(lineRef: LineRefBody) => setLinesRefs(prev => [...prev, lineRef])}
                    />
                ) : (
                    <LyricsLine {...lineProps} />
                );
        }
    }, [currentLine, scrolling, activeLines, currentTime, currentLineStored, resetLines, changeLine]);

    if (!lines.length) return null;

    return (
        <div className={cls.svelte}>
            <div className={classNames(cls.svelteIn, roomData.fullscreen && cls.svelteInFull)} ref={lyricsBoxRef}>
                <div className={cls.lyricsBox}>
                    <div className={classNames(cls.lyrics, roomData.fullscreen && cls.lyricsFull)} ref={lyricsRef}>
                        <div style={{ height: mobile ? "100px" : "220px" }} />
                        {lines.map(renderLine)}
                        <div style={{ height: "380px" }} />
                    </div>
                </div>
            </div>
        </div>
    );
};