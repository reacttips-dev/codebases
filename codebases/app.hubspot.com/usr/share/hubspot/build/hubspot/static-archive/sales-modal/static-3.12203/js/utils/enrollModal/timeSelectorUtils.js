'use es6';

import I18n from 'I18n';
import { HOUR, MINUTE } from 'sales-modal/constants/Milliseconds';
import getAbsoluteTime from './getAbsoluteTime';
export var getTimeOptions = function getTimeOptions(start, end) {
  var prependZero = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var ints = [];
  var current = start;

  while (current <= end) {
    if (current < 10 && prependZero) {
      ints.push("0" + current.toString());
    } else {
      ints.push(current.toString());
    }

    current++;
  }

  return ints;
};
export var convertToTimeObject = function convertToTimeObject(timeOfDay) {
  var time = I18n.moment().utc().startOf('day').add(timeOfDay, 'milliseconds');
  return time.hours() * 60 + time.minutes();
};
export var convertToTimeOfDay = function convertToTimeOfDay(_ref) {
  var hour = _ref.hour,
      minute = _ref.minute,
      period = _ref.period;
  var timeOfDay = hour * HOUR + minute * MINUTE;

  switch (period) {
    case 'AM':
      if (hour === 12) {
        timeOfDay -= 12 * HOUR;
      }

      break;

    case 'PM':
      if (hour !== 12) {
        timeOfDay += 12 * HOUR;
      }

      break;

    default:
      break;
  }

  return timeOfDay;
};
export var timeInputToTimeOfDay = function timeInputToTimeOfDay(value) {
  var minute = value % 60;
  var totalHours = Math.floor(value / 60);
  var period = totalHours >= 12 ? 'PM' : 'AM';
  var hour = totalHours % 12;

  if (hour === 0) {
    hour = 12;
  }

  return convertToTimeOfDay({
    hour: hour,
    minute: minute,
    period: period
  });
};
export var timestampToTimeOfDay = function timestampToTimeOfDay(timestamp, timezone) {
  if (!timestamp || !timezone) {
    return null;
  }

  var time = I18n.moment(timestamp).tz(timezone);
  var minutes = time.hours() * 60 + time.minutes();
  return timeInputToTimeOfDay(minutes);
};
export var getCurrentTimeOfDayInMs = function getCurrentTimeOfDayInMs(moment) {
  var currentMoment = moment || I18n.moment();
  var startOfDay = currentMoment.clone().startOf('day');
  return currentMoment.diff(startOfDay);
};
export var timestampSpecificDayCurrentTime = function timestampSpecificDayCurrentTime(sequenceEnrollment, stepIndex) {
  var stepSendDate = getAbsoluteTime(sequenceEnrollment, stepIndex).stepMoment;
  var startOfDay = stepSendDate.startOf('day');
  return startOfDay + getCurrentTimeOfDayInMs();
};
export var getRecommendedValueForStep = function getRecommendedValueForStep(recommendedSendTimes, step, timezone) {
  var recommendedValue = recommendedSendTimes.find(function (sendTime) {
    return sendTime.get('emailNumber') === step.get('stepOrder');
  });
  if (!recommendedValue) return null;
  var recommendedTimestamp = recommendedValue.get('timestamp');
  var recommendedTimeOfDay = timestampToTimeOfDay(recommendedTimestamp, timezone);
  return convertToTimeObject(recommendedTimeOfDay);
};