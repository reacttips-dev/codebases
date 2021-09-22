import getDaysInMonth from './getDaysInMonth';

export default (timestamp: number | Date, month: number) => {
    const date = new Date(+timestamp);
    var lastDayOfNewMonth = getDaysInMonth(date.getUTCFullYear(), month);
    date.setUTCMonth(month, Math.min(lastDayOfNewMonth, date.getUTCDate()));
    return date;
};
