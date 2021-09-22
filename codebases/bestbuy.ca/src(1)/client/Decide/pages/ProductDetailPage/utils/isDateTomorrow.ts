import {validateDateObjects, isSameDay} from "utils/date";

const isDateTomorrow = (year: number, month: number, day: number): boolean => {
    const tomorrow = new Date(Date.now());
    const compare = new Date(year, month, day);
    tomorrow.setDate(tomorrow.getDate() + 1);
    validateDateObjects(compare);
    return isSameDay(compare, tomorrow);
};

export default isDateTomorrow;
