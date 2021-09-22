export default (timestamp: number | Date) => {
    const date = new Date(+timestamp);
    date.setUTCSeconds(0, 0);
    return date;
};
