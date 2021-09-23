'use es6';

import formatShortDate from 'I18n/utils/formatShortDate';
export var getDateAndTime = function getDateAndTime(startTimeMoment) {
  var dayOfWeek = startTimeMoment.format('ddd');
  var shortDate = formatShortDate(startTimeMoment);
  return {
    date: dayOfWeek + " " + shortDate,
    time: startTimeMoment.format('LT z')
  };
};