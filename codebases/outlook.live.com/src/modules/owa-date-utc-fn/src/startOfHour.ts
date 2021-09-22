export default (timestamp: number | Date) => {
    const date = new Date(+timestamp);
    date.setUTCMinutes(0, 0, 0);
    return date;
};
