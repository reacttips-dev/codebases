// a toFixed() method that returns a number instead of a string
export const getNumToFixed = (num: number, numDecimalPlaces: number): number => (
    parseFloat(num.toFixed(numDecimalPlaces))
);
