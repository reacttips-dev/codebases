export default (timestamp: number | Date) => {
    const date = new Date(+timestamp);
    date.setUTCHours(0, 0, 0, 0);
    return date;
};
