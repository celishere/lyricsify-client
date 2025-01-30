import { buildLines, calcValues, styleLine } from "../utils/lyricsUtils";
import { LyricsMetadata } from "../interfaces/LyricsProps.interface";

describe("buildLines", () => {
    it("should build lines correctly from metadata", () => {
        const metadata: LyricsMetadata = {
            dur: 300000,
            lang: "en",
            timing: "auto",
            songwriters: ["John Doe", "Jane Doe"],
            verses: [
                {
                    begin: 0,
                    end: 2000,
                    partType: "verse",
                    lines: [
                        {
                            id: 0,
                            agent: "",
                            begin: 0,
                            end: 2000,
                            bg: [],
                            key: "",
                            partType: "",
                            words: [{ begin: 0, end: 500, content: "Hello", hasTrailingWhitespace: true, partType: "" }],
                            content: "Hello"
                        }
                    ]
                }
            ]
        };

        const lines = buildLines(metadata);
        expect(lines).toHaveLength(2);
        expect(lines[0].content).toBe("Hello");
        expect(lines[1].partType).toBe("songwritters");
        expect(lines[1].content).toBe("John Doe, Jane Doe");
    });
});

describe("calcValues", () => {
    it("should calculate values correctly for foreground", () => {
        const result = calcValues(50, false);
        expect(result.opacity).toBeCloseTo(0.85 / 120);
        expect(result.matrix).toBeCloseTo(-2 * (70 / 120));
        expect(result.radius).toBeCloseTo((50 / 70) * 9);
    });

    it("should calculate values correctly for background", () => {
        const result = calcValues(50, true);
        expect(result.matrix).toBeCloseTo(-0.5 * (70 / 120));
    });
});

describe("styleLine", () => {
    it("should return correct CSS styles", () => {
        const gradient = 50;
        const radius = 5;
        const opacity = 0.5;
        const matrix = -1;
        const style = styleLine(gradient, radius, opacity, matrix);

        expect(style).toContain(`--gradient-progress: ${gradient}%`);
        expect(style).toContain(`--text-shadow-blur-radius: ${radius}px`);
        expect(style).toContain(`--text-shadow-opacity: ${opacity}`);
        expect(style).toContain(`transform: matrix(1, 0, 0, 1, 0, ${matrix})`);
    });
});