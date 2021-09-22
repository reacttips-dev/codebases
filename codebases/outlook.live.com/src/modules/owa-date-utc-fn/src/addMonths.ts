import setMonth from './setMonth';

export default (timestamp: number | Date, months: number) => {
    const date = new Date(+timestamp);
    var newMonth = date.getUTCMonth() + months;
    return setMonth(timestamp, newMonth);
};
