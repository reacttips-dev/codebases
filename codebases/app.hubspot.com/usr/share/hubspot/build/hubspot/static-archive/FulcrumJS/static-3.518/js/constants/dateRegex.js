'use es6';

var oneToFourDigits = '(\\d{1,4})';
var divider = '(-|/)';
var DATE_REGEX = new RegExp("^" + oneToFourDigits + divider + oneToFourDigits + divider + oneToFourDigits + "$", 'i');
export default DATE_REGEX;