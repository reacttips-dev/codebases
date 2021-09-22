/* Defines formatting options for discourse Q&A. */

import moment from 'moment';

import _t from 'i18n!nls/ondemand';

export const fixNewlineChars = function (text) {
  return text.replace(/\n/g, '<br/>');
};

/**
 * We have a custom duration humanization, different from Moment's. E.g.
 * - 1h 02m
 * - 3 min
 * - 4 sec
 * @deprecated use 'js/utils/DateTimeUtils/humanizeLearningTime' instead
 *
 * @return {string} human readable form of estimated time required for learning
 */
export const humanizeLearningTime = function (milliseconds, displayFullUnit) {
  const duration = moment.duration(milliseconds);

  const seconds = duration.seconds();
  const minutes = duration.minutes();
  const hours = duration.hours() + duration.days() * 24;

  let hourUnit = 'h';
  let minuteUnit = 'm';
  let secondsUnit = 's';

  if (hours && minutes) {
    if (displayFullUnit) {
      hourUnit = hours > 1 ? ' hours' : ' hour';
      minuteUnit = minutes > 1 ? ' minutes' : ' minute';
    }

    return _t('#{hours}#{hourUnit} #{minutes}#{minuteUnit}', { hours, hourUnit, minutes, minuteUnit });
  } else if (hours) {
    if (displayFullUnit) {
      hourUnit = hours > 1 ? ' hours' : ' hour';
    }
    return _t('#{hours}#{hourUnit}', { hours, hourUnit });
  } else if (minutes) {
    if (displayFullUnit) {
      minuteUnit = minutes > 1 ? ' minutes' : ' minute';
    } else {
      minuteUnit = ' min';
    }
    return _t('#{minutes}#{minuteUnit}', { minutes, minuteUnit });
  } else if (seconds !== 0) {
    if (displayFullUnit) {
      secondsUnit = minutes > 1 ? ' seconds' : ' second';
    } else {
      secondsUnit = ' sec';
    }
    return _t('#{seconds}#{secondsUnit}', { seconds, secondsUnit });
  } else {
    return '';
  }
};

/**
 * We have a custom countdown time humanization unsupported by Moment.
 * Format: hh:mm:ss
 * @return {string} human readable form of time in the format of hh:mm:ss
 * maximum time is 30 days
 */
export const countDownTime = function (milliseconds) {
  const duration = moment.duration(milliseconds);

  let seconds = duration.seconds();
  let minutes = duration.minutes();
  let hours = duration.hours() + duration.days() * 24;

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return `${hours}:${minutes}:${seconds}`;
};

export default {
  fixNewlineChars,
  humanizeLearningTime,
  countDownTime,
};
