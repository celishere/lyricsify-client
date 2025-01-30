import { formatDate } from './date';

const SECONDS_PER_MONTH = 2592000;
const MONTH_NAMES = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

describe('formatDate', () => {
    it('should return "мин." for times less than 1 hour', () => {
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
        expect(formatDate(oneMinuteAgo.toISOString())).toBe('1 мин.');

        const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
        expect(formatDate(twoMinutesAgo.toISOString())).toBe('2 мин.');
    });

    it('should return "ч." for times less than 1 day', () => {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        expect(formatDate(oneHourAgo.toISOString())).toBe('1ч.');

        const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
        expect(formatDate(threeHoursAgo.toISOString())).toBe('3ч.');
    });

    it('should return days string for times less than 1 week', () => {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        expect(formatDate(oneDayAgo.toISOString())).toBe('1 день назад');

        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        expect(formatDate(threeDaysAgo.toISOString())).toBe('3 дня назад');

        const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
        expect(formatDate(fiveDaysAgo.toISOString())).toBe('5 дней назад');
    });

    it('should return weeks string for times less than 1 month', () => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        expect(formatDate(oneWeekAgo.toISOString())).toBe('1 неделю назад');
    });

    it('should return formatted date for times older than 1 month', () => {
        const now = new Date();
        const date = new Date(now.getTime() - 2 * SECONDS_PER_MONTH * 1000); // примерно 2 месяца назад
        const expectedDate = `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
        expect(formatDate(date.toISOString())).toBe(expectedDate);
    });
});
