import React, {
    forwardRef,
    useEffect,
    useRef,
    useMemo,
    ReactNode,
} from "react";
import { AnimatePresence } from "framer-motion";
import classNames from "classnames";

import { ILyricsLine, LineRefBody } from "../../interfaces/LyricsProps.interface";
import cls from "./RichLyricsLine.module.scss";

interface LyricsLineProps {
    line: ILyricsLine;
    isScrolling: boolean;
    currentLine: number | null;
    currentLineStored: number | null;
    setCurrentLineStored: (num: number) => void;
    resetLines: () => void;
    activeLines: number[];
    pushLine: (line: LineRefBody) => void;
    changeLine: (id: number, force?: boolean) => void;
}

const RichLyricsLine = forwardRef<HTMLDivElement, LyricsLineProps>(
    (props, ref) => {
        const {
            line,
            isScrolling,
            currentLine,
            currentLineStored,
            setCurrentLineStored,
            resetLines,
            activeLines,
            pushLine,
            changeLine,
        } = props;

        const isCurrent =
            (currentLine === line.id || activeLines.includes(line.id)) &&
            "true";
        const isHidden =
            currentLine &&
            currentLine > line.id &&
            !isScrolling &&
            !activeLines.includes(line.id);

        const lineRef = useRef<HTMLSpanElement | null>(null);

        const maxId = useMemo(() => {
            let maxId = "";
            let maxTime = 0;
            line.words.forEach((word, index) => {
                if (word.end > maxTime) {
                    maxTime = word.end;
                    maxId = `${line.key}-${index}`.replace("L", "");
                }
            });

            line.bg.forEach((word, index) => {
                if (word.end > maxTime) {
                    maxTime = word.end;
                    maxId = `${line.key}-${index}-bg`.replace("L", "");
                }
            });
            return maxId;
        }, [line]);

        useEffect(() => {
            if (currentLine === line.id && currentLineStored !== line.id) {
                setCurrentLineStored(line.id);
                resetLines();
            }
        }, [currentLine, line.id, currentLineStored, setCurrentLineStored, resetLines]);

        if (line.words.length === 0) {
            return null;
        }

        const renderWordElement = (word: any, index: number, isBackground: boolean = false) => {
            if (word.end === 0) return null;
            const adjustedBegin = word.begin - line.begin;
            const adjustedEnd = word.end - word.begin;
            const clearDelay = line.end - word.end - 100;
            const letters: string[] = word.content.split("");
            const wordKey = `${line.id}-${index}${isBackground ? "-bg" : ""}-line`;
            const wordId = `${line.id}-${index}${isBackground ? "-bg" : ""}`;
            const letterIdPrefix = `${line.id}-${index}`;

            return (
                <AnimatePresence key={wordKey}>
                  <span
                      className={classNames(
                          cls.syncBg,
                          cls.syncWord,
                          cls.richLetter,
                          cls.richLine,
                          isBackground && cls.richBgLine
                      )}
                      ref={(element) => {
                          if (currentLine === line.id) {
                              pushLine({
                                  lineId: line.id,
                                  id: wordId,
                                  maxId: maxId,
                                  item: element,
                                  delay: adjustedBegin,
                                  duration: adjustedEnd,
                                  clearDelay,
                                  isBackground,
                              } as LineRefBody);
                          }
                      }}
                  >
                      {letters.map((letter, letterIndex) => (
                          <span
                              id={`${letterIdPrefix}-${letterIndex}${isBackground ? "-wordBg" : "-word"}`}
                              key={`${letterIdPrefix}-${letterIndex}${isBackground ? "-wordBg" : "-word"}`}
                          >
                              <a className={currentLine === line.id ? cls.letterTransition : ""}>
                                  {letter.replace("(", "").replace(")", "")}
                                  {letters.length - 1 === letterIndex &&
                                      word.hasTrailingWhitespace && (
                                          <a
                                              style={{
                                                  minWidth: isBackground ? "4px" : "8px",
                                                  display: "inline-block",
                                              }}
                                          />
                                      )}
                              </a>
                          </span>
                      ))}
                    </span>
                </AnimatePresence>
            );
        }

        const renderWords = (words: any[]): ReactNode => {
            const elements: ReactNode[] = [];
            let combinedElements: ReactNode[] = [];
            const regex = /\([^)]+\)/;

            line.words
                .filter((word) => !regex.test(word.content))
                .forEach((word, index) => {
                    const wordElement = renderWordElement(word, index);
                    if (!wordElement) return;

                    if (word.hasTrailingWhitespace) {
                        combinedElements.push(wordElement);
                        elements.push(
                            <span
                                key={`${line.id}-${index}-combined`}
                                id={`${line.id}-${index}-combined`}
                                className={classNames(cls.richBox, combinedElements.length > 1 ? cls.richBoxCombined : "")}
                            >
                                {combinedElements}
                             </span>
                        );
                        combinedElements = [];
                    } else {
                        combinedElements.push(wordElement);
                    }
                });
            if (combinedElements.length > 0) {
                elements.push(
                    <span
                        key={`${line.id}-combined-end`}
                        id={`${line.id}-combined-end`}
                        className={classNames(cls.richBox, combinedElements.length > 1 ? cls.richBoxCombined : "")}
                    >
                        {combinedElements}
                     </span>
                );
            }
            return elements;
        };

        return (
            <div
                ref={ref}
                className={classNames(
                    cls.lineBlock,
                    isHidden ? cls.hiddenLine : "",
                    line.agent !== "v1" ? cls.lineBlockAgent : ""
                )}
                data-current={isCurrent}
                data-content={line.content}
                onClick={() => changeLine(line.id, true)}
            >
                <span
                    ref={lineRef}
                    className={classNames(
                        cls.syncLineBox,
                        cls.richLine,
                        line.agent !== "v1" ? cls.lineAgent : cls.noAgentLine
                    )}
                >
                  {renderWords(line.words)}
                    {line.bg.length > 0 && (
                        <div
                            className={classNames(
                                cls.bgWordsBox,
                                (currentLine === line.id ||
                                    activeLines.includes(line.id)) &&
                                cls.bgWordsActive,
                                line.agent !== "v1" && cls.bgWordsBoxReverse
                            )}
                        >
                            {line.bg.map((word, index) => renderWordElement(word, index, true))}
                        </div>
                    )}
                 </span>
            </div>
        );
    }
);

export default RichLyricsLine;