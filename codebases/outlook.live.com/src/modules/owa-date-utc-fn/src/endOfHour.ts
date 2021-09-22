export default (timestamp: number | Date) => {
    const date = new Date(+timestamp);
    date.setUTCMinutes(59, 59, 999);
    return date;
};
