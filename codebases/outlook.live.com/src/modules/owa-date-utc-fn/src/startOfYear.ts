export default (timestamp: number | Date) => {
    const date = new Date(+timestamp);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
    return date;
};
