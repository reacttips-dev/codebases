export const isDateObject = (date: Date): boolean => {
    if (date && Object.prototype.toString.call(date) === "[object Date]") {
        return true;
    }
    return false;
};

export const validateDateObjects = (...inputs: Date[]): boolean => {
    inputs.forEach((input: Date) => {
        if (!isDateObject(input)) {
            throw new Error("Invalid date");
        }
    });
    return true;
};

export const isSameDay = (firstDate: Date, secondDate: Date): boolean => {
    validateDateObjects(firstDate, secondDate);
    return (
        firstDate.getDate() === secondDate.getDate() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getFullYear() === secondDate.getFullYear()
    );
};

export const getNumDaysFromToday = (date: Date): number => {
    validateDateObjects(date);
    const today = new Date(Date.now());
    const constructedDate = new Date(date);
    return getDifferenceInDays(constructedDate, today);
};

const getDifferenceInDays = (date1: Date, date2: Date): number => {
    validateDateObjects(date1, date2);

    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

    const timeDifference = Math.abs(d1.getTime() - d2.getTime());
    const day = 1000 * 60 * 60 * 24;
    return Math.round(timeDifference / day);
};
