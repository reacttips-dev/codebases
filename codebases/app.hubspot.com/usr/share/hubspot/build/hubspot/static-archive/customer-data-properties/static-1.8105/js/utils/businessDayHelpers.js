'use es6';

export function snapToBusinessDay(momentDate) {
  var SATURDAY = 6;
  var SUNDAY = 7;
  var NEXT_MONDAY = 8;

  if (momentDate.isoWeekday() === SATURDAY || momentDate.isoWeekday() === SUNDAY) {
    // set to the monday after
    return momentDate.clone().isoWeekday(NEXT_MONDAY);
  }

  return momentDate;
}
export function addBusinessDays(fromDate, days) {
  var toDate = fromDate.clone();

  for (var i = 0; i < days; i++) {
    toDate = snapToBusinessDay(toDate.add(1, 'day'));
  }

  return toDate;
}