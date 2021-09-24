'use es6';

export var addWeekdays = function addWeekdays(momentDate, days) {
  while (days > 0) {
    momentDate = momentDate.add(1, 'days');

    if (momentDate.isoWeekday() !== 6 && momentDate.isoWeekday() !== 7) {
      days -= 1;
    }
  }

  return momentDate;
};
export var minutesToMilliseconds = function minutesToMilliseconds(minutes) {
  return minutes * 60 * 1000;
};