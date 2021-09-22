import numeral from "numeral";

const DECIMAL_SEP = ".";

/**
 * format a number to a decimal point
 * test for this function are in numberFilter.spec.ts and are taken from angular.js
 */
export const numberFilter: () => (num: number | string, decimal?: number) => string = () => (
    num,
    decimal,
) => {
    if (num == null) return num as string;

    const isFloat = num.toString().includes(DECIMAL_SEP);
    const isNan = isNaN(Number(num));
    const isObject = typeof num === "object";
    const isInfinity = num === Infinity;
    const isNegativeInfinity = num === -Infinity;

    if (isFloat || decimal) {
        return pureNumberFilter(num, `0,0.${"0".repeat(decimal ?? 3)}`);
    } else if (isNan || isObject) {
        return "";
    } else if (isInfinity) {
        return "∞";
    } else if (isNegativeInfinity) {
        return "-∞";
    } else {
        return pureNumberFilter(num, "0,0");
    }
};

export const pureNumberFilter = (num: number | string, format = "0,0.[000]"): string => {
    if (num === null) {
        return "N/A";
    }
    return numeral(num).format(format);
};
