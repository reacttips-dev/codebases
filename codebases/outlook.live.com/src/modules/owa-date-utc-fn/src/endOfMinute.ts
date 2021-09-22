export default (timestamp: number | Date) => {
    const date = new Date(+timestamp);
    date.setUTCSeconds(59, 999);
    return date;
};
