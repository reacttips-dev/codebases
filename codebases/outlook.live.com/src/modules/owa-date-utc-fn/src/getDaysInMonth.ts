export default (year: number, month: number) => {
    var lastDayOfMonth = new Date(0);
    lastDayOfMonth.setUTCFullYear(year, month + 1, 0);
    return lastDayOfMonth.getUTCDate();
};
