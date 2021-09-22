export const validatePostalCode = (
    val: string,
    minPostalCodeLength: number,
    validateCompletePostalCode: boolean,
): boolean => {
    if (val.length === minPostalCodeLength && !validateCompletePostalCode) {
        return /^[A-Za-z]\d[A-Za-z][ ]?$/.test(val);
    } else {
        return /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/.test(val);
    }
};
