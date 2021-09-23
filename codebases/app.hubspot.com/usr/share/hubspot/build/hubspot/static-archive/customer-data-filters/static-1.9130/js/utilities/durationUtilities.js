'use es6';

export var MINUTES = 'minutes';
export var HOURS = 'hours';
export var DAYS = 'days';
export var getDefaultUnit = function getDefaultUnit(duration) {
  if (duration % (24 * 60 * 60 * 1000) === 0) {
    return DAYS;
  }

  if (duration % (60 * 60 * 1000) === 0) {
    return HOURS;
  }

  return MINUTES;
};
export var formatDurationToUnit = function formatDurationToUnit(duration, unit) {
  if (duration === undefined) {
    return undefined;
  }

  switch (unit) {
    case DAYS:
      return duration / 1000 / 60 / 60 / 24;

    case HOURS:
      return duration / 1000 / 60 / 60;

    case MINUTES:
    default:
      return duration / 1000 / 60;
  }
};
export var formatDurationToMilliseconds = function formatDurationToMilliseconds(duration, unit) {
  switch (unit) {
    case DAYS:
      return duration * 1000 * 60 * 60 * 24;

    case HOURS:
      return duration * 1000 * 60 * 60;

    case MINUTES:
    default:
      return duration * 1000 * 60;
  }
};