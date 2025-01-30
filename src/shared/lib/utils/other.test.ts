import { isSafari } from './other';

describe('isSafari', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return true for Safari user agent', () => {
        jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15'
        );
        expect(isSafari()).toBe(true);
    });

    it('should return false for Chrome user agent', () => {
        jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        );
        expect(isSafari()).toBe(false);
    });

    it('should return false for Firefox user agent', () => {
        jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
        );
        expect(isSafari()).toBe(false);
    });

    it('should return false for Edge user agent', () => {
        jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
        );
        expect(isSafari()).toBe(false);
    });

    it('should return false for Android Chrome user agent', () => {
        jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
            'Mozilla/5.0 (Linux; Android 11; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
        );
        expect(isSafari()).toBe(false);
    });

    it('should return true for iPad Safari user agent', () => {
        jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
            'Mozilla/5.0 (iPad; CPU OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15'
        );
        expect(isSafari()).toBe(true);
    });

    it('should return false for empty user agent string (edge case, but good to handle)', () => {
        jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue('');
        expect(isSafari()).toBe(false);
    });
});