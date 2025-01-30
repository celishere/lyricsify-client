const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_WEEK = 604800;
const SECONDS_PER_MONTH = 2592000;

const MONTH_NAMES = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

const getDayString = (days: number): string => {
    if (days === 1) {
        return 'день';
    } else if (days < 5) {
        return 'дня';
    } else {
        return 'дней';
    }
};

const getWeekString = (weeks: number): string => {
    if (weeks === 1) {
        return 'неделю';
    } else {
        return 'недель';
    }
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();

    const diffInSeconds = (now.getTime() - date.getTime()) / 1000;

    if (diffInSeconds < SECONDS_PER_HOUR) {
        const minutes = Math.floor(diffInSeconds / SECONDS_PER_MINUTE);
        return `${minutes} мин.`;
    } else if (diffInSeconds < SECONDS_PER_DAY) {
        const hours = Math.floor(diffInSeconds / SECONDS_PER_HOUR);
        return `${hours}ч.`;
    } else if (diffInSeconds < SECONDS_PER_WEEK) {
        const days = Math.floor(diffInSeconds / SECONDS_PER_DAY);
        return `${days} ${getDayString(days)} назад`;
    } else if (diffInSeconds < SECONDS_PER_MONTH) {
        const weeks = Math.floor(diffInSeconds / SECONDS_PER_WEEK);
        return `${weeks} ${getWeekString(weeks)} назад`;
    } else {
        const month = MONTH_NAMES[date.getMonth()];

        return `${date.getDate()} ${month}`;
    }
}