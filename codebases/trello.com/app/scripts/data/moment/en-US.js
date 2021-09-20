// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
const moment = require('moment');

moment.locale('en-US', {
  calendar: require('./english-calendar'),
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'MM/DD/YYYY',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY LT',
    LLLL: 'MMMM D'
  },
  ordinal(number) {
    const b = number % 10;
    const output = (~~((number % 100) / 10) === 1) ?
      "th"
    : b === 1 ?
      "st"
    : b === 2 ?
      "nd"
    : b === 3 ?
      "rd"
    :
      "th";
    return String(number) + output;
  },
}
);
