export default (timestamp: number | Date, weekStartsOn: number) => {
    const date = new Date(+timestamp);
    var day = date.getUTCDay();
    var diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
    date.setUTCDate(date.getUTCDate() + diff);
    date.setUTCHours(23, 59, 59, 999);
    return date;
};
