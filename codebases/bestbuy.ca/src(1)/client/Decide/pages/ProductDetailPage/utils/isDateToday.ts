import {validateDateObjects, isSameDay} from "utils/date";

const isDateToday = (year: number, month: number, day: number) => {
    const today = new Date(Date.now());
    const compare = new Date(year, month, day);
    validateDateObjects(compare);
    return isSameDay(compare, today);
};
export default isDateToday;
