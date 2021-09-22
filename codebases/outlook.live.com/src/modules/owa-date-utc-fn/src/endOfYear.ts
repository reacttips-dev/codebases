export default (timestamp: number | Date) => {
    const date = new Date(+timestamp);
    date.setUTCFullYear(date.getUTCFullYear() + 1, 0, 0);
    date.setUTCHours(23, 59, 59, 999);
    return date;
};
