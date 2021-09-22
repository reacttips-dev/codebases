import * as moment from "moment";
export const isPostalCode = (val) => {
    const re = new RegExp("^[A-Za-z][0-9][A-Za-z][ ]?[0-9][A-Za-z][0-9]$");
    return re.test(String(val));
};
export const hasAddressChars = (val) => {
    const re = new RegExp("^([a-zA-Z0-9'-.\\sÉÈÊËéèêëÎÏîïÔôÙÛÜùûüÂÀâàÇç]*)$");
    return re.test(String(val));
};
export const isZipCode = (val) => {
    const re = new RegExp("^[0-9]{5}$");
    return re.test(String(val));
};
export const hasNameChars = (val) => {
    const re = new RegExp("^([a-zA-Z'-.\\sÉÈÊËéèêëÎÏîïÔôÙÛÜùûüÂÀâàÇç]*)$");
    return re.test(String(val));
};
export const hasPhoneChars = (val) => {
    const re = new RegExp("^([0-9\\s()–-]*)$");
    return re.test(String(val));
};
export const hasPostalCodeChars = (val) => {
    const re = new RegExp("^([0-9A-Za-z\\s]*)$");
    return re.test(String(val));
};
export const hasZipCodeChars = (val) => {
    const re = new RegExp("^([0-9\\s]*)$");
    return re.test(String(val));
};
export const required = (val) => {
    return !!val.length;
};
// tslint:disable-next-line:no-shadowed-variable
export const maxLength = (maxLength) => (val) => {
    return val ? val.replace(/ +?/g, "").length <= maxLength : true;
};
// tslint:disable-next-line:no-shadowed-variable
export const minLength = (minLength) => (val) => {
    return val ? val.replace(/ +?/g, "").length >= minLength : false;
};
export const numbersOnly = (val) => {
    const re = new RegExp("^([0-9]*)$");
    return re.test(String(val));
};
export const isValidEmailFormat = (val) => {
    const re = new RegExp("^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$");
    return re.test(val);
};
export const isValidDate = (val) => {
    const dateFormat = "MMDDYYYY";
    return moment(val, dateFormat, true).isValid();
};
//# sourceMappingURL=validationRules.js.map