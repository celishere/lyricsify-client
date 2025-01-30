import { convertSecondsToMinSec } from './numbers';

describe('convertSecondsToMinSec', () => {
    it('should return "0:00" for 0 seconds', () => {
        expect(convertSecondsToMinSec(0)).toBe("0:00");
    });

    it('should return "0:01" for 1 second', () => {
        expect(convertSecondsToMinSec(1)).toBe("0:01");
    });

    it('should return "0:09" for 9 seconds', () => {
        expect(convertSecondsToMinSec(9)).toBe("0:09");
    });

    it('should return "0:10" for 10 seconds', () => {
        expect(convertSecondsToMinSec(10)).toBe("0:10");
    });

    it('should return "0:59" for 59 seconds', () => {
        expect(convertSecondsToMinSec(59)).toBe("0:59");
    });

    it('should return "1:00" for 60 seconds', () => {
        expect(convertSecondsToMinSec(60)).toBe("1:00");
    });

    it('should return "1:01" for 61 seconds', () => {
        expect(convertSecondsToMinSec(61)).toBe("1:01");
    });

    it('should return "2:00" for 120 seconds', () => {
        expect(convertSecondsToMinSec(120)).toBe("2:00");
    });

    it('should return "10:30" for 630 seconds', () => {
        expect(convertSecondsToMinSec(630)).toBe("10:30");
    });

    it('should return "59:59" for 3599 seconds', () => {
        expect(convertSecondsToMinSec(3599)).toBe("59:59");
    });

    it('should return "0:00" for NaN input', () => {
        expect(convertSecondsToMinSec(NaN)).toBe("0:00");
    });

    it('should return "0:00" for null input (treated as NaN by isNaN)', () => {
        expect(convertSecondsToMinSec(null as any)).toBe("0:00");
    });

    it('should return "0:00" for undefined input (treated as NaN by isNaN)', () => {
        expect(convertSecondsToMinSec(undefined as any)).toBe("0:00");
    });

    it('should handle decimal seconds correctly (floor to integer seconds)', () => {
        expect(convertSecondsToMinSec(61.7)).toBe("1:01"); // 61.7 seconds
        expect(convertSecondsToMinSec(59.9)).toBe("0:59"); // 59.9 seconds
    });

    it('should handle negative seconds as if they are 0 (or floor towards zero)', () => {
        expect(convertSecondsToMinSec(-5)).toBe("0:00");
        expect(convertSecondsToMinSec(-60)).toBe("0:00");
    });
});