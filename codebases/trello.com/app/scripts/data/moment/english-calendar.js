// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
const makeYearAwareCalendar = require('./make-year-aware-calendar');

module.exports = makeYearAwareCalendar({
  lastDay: '[yesterday at] LT',
  sameDay: '[today at] LT',
  nextDay: '[tomorrow at] LT',
  lastWeek: 'llll [at] LT',
  nextWeek: 'llll [at] LT',
  sameYear: 'llll [at] LT',
  sameElse: 'll [at] LT'
});
