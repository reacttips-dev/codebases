export const isNumeric = (val: any): boolean => Number.isInteger(parseInt(val, 10));

export const inRange = (min: number, max: number) => (val: any): boolean => isNumeric(val) && val >= min && val <= max;
