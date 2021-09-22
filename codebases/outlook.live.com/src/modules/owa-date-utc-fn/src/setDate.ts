export default (timestamp: number | Date, dayOfMonth: number) => {
    const date = new Date(+timestamp);
    date.setUTCDate(dayOfMonth);
    return date;
};
