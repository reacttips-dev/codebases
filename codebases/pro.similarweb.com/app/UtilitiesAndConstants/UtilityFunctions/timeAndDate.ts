import dayjs from "dayjs";

export const getMonthDetails = (sysdate = dayjs().utc()) => {
    const monthName = sysdate.format("MMMM");
    const monthNumber = sysdate.format("M");
    return { monthNumber, monthName };
};
