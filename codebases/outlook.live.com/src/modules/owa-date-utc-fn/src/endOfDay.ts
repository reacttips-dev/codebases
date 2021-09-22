export default (timestamp: number | Date) => {
    const date = new Date(+timestamp);
    date.setUTCHours(23, 59, 59, 999);
    return date;
};
